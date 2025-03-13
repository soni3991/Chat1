import { supabase } from "@/lib/supabase";
import {
  User,
  Message,
  Friend,
  FriendRequest,
  Chat,
  Conversation,
  FeatureToggle,
  ConversationData,
  FlaggedMessage,
} from "@/types";

// Authentication Services
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) throw new Error(profileError.message);

    return {
      id: data.user.id,
      name: profile.name || data.user.email?.split("@")[0] || "User",
      email: data.user.email || "",
      avatar: profile.avatar_url,
      role: profile.role || "user",
    };
  },

  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw new Error(error.message);

    // Create profile entry
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user?.id,
        name,
        email,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role: "user",
      },
    ]);

    if (profileError) throw new Error(profileError.message);

    return {
      id: data.user?.id || "",
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role: "user",
    };
  },

  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) return null;

    // Get user profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (error) return null;

    return {
      id: data.user.id,
      name: profile.name || data.user.email?.split("@")[0] || "User",
      email: data.user.email || "",
      avatar: profile.avatar_url,
      role: profile.role || "user",
    };
  },

  updateProfile: async (
    userId: string,
    updates: Partial<User>,
  ): Promise<User> => {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: updates.name,
        avatar_url: updates.avatar,
        // Don't update role through this function for security
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: userId,
      name: data.name,
      email: data.email,
      avatar: data.avatar_url,
      role: data.role,
    };
  },
};

// Messaging Services
export const messageService = {
  getConversations: async (userId: string): Promise<Chat[]> => {
    // Get all conversations where the user is a participant
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(
        `
        id,
        participants:conversation_participants(user_id),
        last_message:messages(id, content, created_at, status, sender_id)
      `,
      )
      .eq("conversation_participants.user_id", userId)
      .order("last_message.created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Transform the data to match the Chat interface
    const chats: Chat[] = await Promise.all(
      conversations.map(async (conv) => {
        // Get the other participant's info
        const otherParticipantId = conv.participants.find(
          (p: any) => p.user_id !== userId,
        )?.user_id;

        const { data: otherUser } = await supabase
          .from("profiles")
          .select("name, avatar_url, last_seen, status")
          .eq("id", otherParticipantId)
          .single();

        // Get unread count
        const { count } = await supabase
          .from("messages")
          .select("id", { count: "exact" })
          .eq("conversation_id", conv.id)
          .eq("sender_id", otherParticipantId)
          .eq("status", "delivered");

        const lastMessage = conv.last_message[0];

        return {
          id: conv.id,
          name: otherUser?.name || "Unknown User",
          avatar: otherUser?.avatar_url,
          lastMessage: {
            id: lastMessage?.id || "",
            content: lastMessage?.content || "Start a conversation",
            timestamp: new Date(lastMessage?.created_at).toLocaleString(),
            status: lastMessage?.status || "sent",
            isUnread:
              lastMessage?.sender_id !== userId &&
              lastMessage?.status !== "read",
          },
          unreadCount: count || 0,
          isOnline: otherUser?.status === "online",
        };
      }),
    );

    return chats;
  },

  getConversation: async (
    conversationId: string,
    userId: string,
  ): Promise<Conversation> => {
    // Get conversation details
    const { data: conv, error } = await supabase
      .from("conversations")
      .select(
        `
        id,
        participants:conversation_participants(user_id, profile:profiles(id, name, avatar_url, status, last_seen))
      `,
      )
      .eq("id", conversationId)
      .single();

    if (error) throw new Error(error.message);

    // Get the recipient (other participant)
    const recipient = conv.participants.find(
      (p: any) => p.user_id !== userId,
    )?.profile;

    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select(
        `
        id,
        content,
        created_at,
        status,
        sender_id,
        sender:profiles(id, name, avatar_url),
        media
      `,
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (messagesError) throw new Error(messagesError.message);

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ status: "read" })
      .eq("conversation_id", conversationId)
      .eq("sender_id", recipient.id)
      .neq("status", "read");

    return {
      id: conversationId,
      recipient: {
        id: recipient.id,
        name: recipient.name,
        avatar: recipient.avatar_url,
        status: recipient.status || "offline",
        lastSeen: recipient.last_seen
          ? new Date(recipient.last_seen)
          : new Date(),
      },
      messages: messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: {
          id: msg.sender.id,
          name: msg.sender.name,
          avatar: msg.sender.avatar_url,
        },
        timestamp: new Date(msg.created_at),
        status: msg.status,
        isCurrentUser: msg.sender_id === userId,
        media: msg.media,
      })),
    };
  },

  sendMessage: async (
    conversationId: string,
    content: string,
    senderId: string,
  ): Promise<Message> => {
    // Insert the message
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversationId,
          content,
          sender_id: senderId,
          status: "sent",
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Get sender info
    const { data: sender } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .eq("id", senderId)
      .single();

    // Update conversation's last_activity
    await supabase
      .from("conversations")
      .update({ last_activity: new Date().toISOString() })
      .eq("id", conversationId);

    return {
      id: data.id,
      content: data.content,
      sender: {
        id: sender.id,
        name: sender.name,
        avatar: sender.avatar_url,
      },
      timestamp: new Date(data.created_at),
      status: data.status,
      isCurrentUser: true,
    };
  },

  attachMedia: async (
    conversationId: string,
    senderId: string,
    file: File,
  ): Promise<Message> => {
    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `media/${conversationId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-media")
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("chat-media")
      .getPublicUrl(filePath);

    const fileType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : "file";

    // Create message with media
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversationId,
          content: `Sent a ${fileType}`,
          sender_id: senderId,
          status: "sent",
          media: [
            {
              type: fileType,
              url: urlData.publicUrl,
              name: file.name,
              size: file.size,
            },
          ],
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Get sender info
    const { data: sender } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .eq("id", senderId)
      .single();

    // Update conversation's last_activity
    await supabase
      .from("conversations")
      .update({ last_activity: new Date().toISOString() })
      .eq("id", conversationId);

    return {
      id: data.id,
      content: data.content,
      sender: {
        id: sender.id,
        name: sender.name,
        avatar: sender.avatar_url,
      },
      timestamp: new Date(data.created_at),
      status: data.status,
      isCurrentUser: true,
      media: data.media,
    };
  },

  createConversation: async (
    userId: string,
    recipientId: string,
  ): Promise<string> => {
    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("conversation_participants.user_id", userId)
      .eq("conversation_participants.user_id", recipientId);

    if (existingConv && existingConv.length > 0) {
      return existingConv[0].id;
    }

    // Create new conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert([{ created_by: userId }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Add participants
    const { error: participantsError } = await supabase
      .from("conversation_participants")
      .insert([
        { conversation_id: data.id, user_id: userId },
        { conversation_id: data.id, user_id: recipientId },
      ]);

    if (participantsError) throw new Error(participantsError.message);

    return data.id;
  },
};

// Friends Services
export const friendService = {
  getFriends: async (userId: string): Promise<Friend[]> => {
    const { data, error } = await supabase
      .from("friends")
      .select(
        `
        id,
        friend_id,
        friend:profiles(id, name, avatar_url, status, last_seen)
      `,
      )
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    return data.map((item) => ({
      id: item.friend.id,
      name: item.friend.name,
      avatar: item.friend.avatar_url,
      status: item.friend.status || "offline",
      lastSeen: item.friend.last_seen
        ? new Date(item.friend.last_seen).toLocaleString()
        : undefined,
    }));
  },

  getFriendRequests: async (
    userId: string,
  ): Promise<{ incoming: FriendRequest[]; outgoing: FriendRequest[] }> => {
    // Get incoming requests
    const { data: incoming, error: incomingError } = await supabase
      .from("friend_requests")
      .select(
        `
        id,
        created_at,
        sender:profiles(id, name, avatar_url, last_seen)
      `,
      )
      .eq("recipient_id", userId)
      .eq("status", "pending");

    if (incomingError) throw new Error(incomingError.message);

    // Get outgoing requests
    const { data: outgoing, error: outgoingError } = await supabase
      .from("friend_requests")
      .select(
        `
        id,
        created_at,
        recipient:profiles(id, name, avatar_url, last_seen)
      `,
      )
      .eq("sender_id", userId)
      .eq("status", "pending");

    if (outgoingError) throw new Error(outgoingError.message);

    return {
      incoming: incoming.map((req) => ({
        id: req.id,
        user: {
          id: req.sender.id,
          name: req.sender.name,
          avatar: req.sender.avatar_url,
          lastSeen: req.sender.last_seen
            ? new Date(req.sender.last_seen).toLocaleString()
            : "Unknown",
        },
        timestamp: new Date(req.created_at).toISOString(),
      })),
      outgoing: outgoing.map((req) => ({
        id: req.id,
        user: {
          id: req.recipient.id,
          name: req.recipient.name,
          avatar: req.recipient.avatar_url,
          lastSeen: req.recipient.last_seen
            ? new Date(req.recipient.last_seen).toLocaleString()
            : "Unknown",
        },
        timestamp: new Date(req.created_at).toISOString(),
      })),
    };
  },

  sendFriendRequest: async (
    senderId: string,
    recipientId: string,
  ): Promise<void> => {
    const { error } = await supabase.from("friend_requests").insert([
      {
        sender_id: senderId,
        recipient_id: recipientId,
        status: "pending",
      },
    ]);

    if (error) throw new Error(error.message);
  },

  acceptFriendRequest: async (
    requestId: string,
    userId: string,
  ): Promise<void> => {
    // Get the request details
    const { data: request, error: requestError } = await supabase
      .from("friend_requests")
      .select("sender_id, recipient_id")
      .eq("id", requestId)
      .single();

    if (requestError) throw new Error(requestError.message);

    // Verify the recipient is the current user
    if (request.recipient_id !== userId) {
      throw new Error("Unauthorized action");
    }

    // Update request status
    const { error: updateError } = await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (updateError) throw new Error(updateError.message);

    // Create friend relationships (bidirectional)
    const { error: friendError } = await supabase.from("friends").insert([
      { user_id: userId, friend_id: request.sender_id },
      { user_id: request.sender_id, friend_id: userId },
    ]);

    if (friendError) throw new Error(friendError.message);
  },

  declineFriendRequest: async (
    requestId: string,
    userId: string,
  ): Promise<void> => {
    // Verify the recipient is the current user
    const { data: request, error: requestError } = await supabase
      .from("friend_requests")
      .select("recipient_id")
      .eq("id", requestId)
      .single();

    if (requestError) throw new Error(requestError.message);

    if (request.recipient_id !== userId) {
      throw new Error("Unauthorized action");
    }

    // Update request status
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "declined" })
      .eq("id", requestId);

    if (error) throw new Error(error.message);
  },

  removeFriend: async (userId: string, friendId: string): Promise<void> => {
    // Remove both friendship records (bidirectional)
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(
        `(user_id.eq.${userId}.and.friend_id.eq.${friendId}),(user_id.eq.${friendId}.and.friend_id.eq.${userId})`,
      );

    if (error) throw new Error(error.message);
  },

  searchUsers: async (query: string, userId: string): Promise<Friend[]> => {
    // Search for users by name or username
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, username, avatar_url, status, last_seen")
      .or(`name.ilike.%${query}%,username.ilike.%${query}%`)
      .neq("id", userId) // Exclude current user
      .limit(20);

    if (error) throw new Error(error.message);

    // Get mutual friends count for each user
    const friends = await Promise.all(
      data.map(async (user) => {
        const { count } = await supabase.rpc("get_mutual_friends_count", {
          user_id_1: userId,
          user_id_2: user.id,
        });

        return {
          id: user.id,
          name: user.name,
          username:
            user.username || user.name.toLowerCase().replace(/\s+/g, "."),
          avatar: user.avatar_url,
          status: user.status || "offline",
          lastSeen: user.last_seen
            ? new Date(user.last_seen).toLocaleString()
            : undefined,
          mutualFriends: count || 0,
          isVerified: false, // This would come from your verification system
        };
      }),
    );

    return friends;
  },

  togglePrivacy: async (userId: string, isPrivate: boolean): Promise<void> => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_private: isPrivate })
      .eq("id", userId);

    if (error) throw new Error(error.message);
  },
};

// Admin Services
export const adminService = {
  getFeatures: async (): Promise<FeatureToggle[]> => {
    const { data, error } = await supabase.from("features").select("*");

    if (error) throw new Error(error.message);

    return data.map((feature) => ({
      id: feature.id,
      name: feature.name,
      description: feature.description,
      enabled: feature.enabled,
      category: feature.category,
    }));
  },

  toggleFeature: async (featureId: string, enabled: boolean): Promise<void> => {
    const { error } = await supabase
      .from("features")
      .update({ enabled })
      .eq("id", featureId);

    if (error) throw new Error(error.message);
  },

  getConversationData: async (): Promise<ConversationData[]> => {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        id,
        last_activity,
        participants:conversation_participants(user_id, profile:profiles(name)),
        message_count:messages(count),
        flagged_count:messages(count)
      `,
      )
      .eq("messages.is_flagged", true);

    if (error) throw new Error(error.message);

    return data.map((conv) => ({
      id: conv.id,
      participants: conv.participants.map((p: any) => p.profile.name),
      lastActive: new Date(conv.last_activity).toLocaleString(),
      messageCount: conv.message_count.length,
      flaggedCount: conv.flagged_count.length,
    }));
  },

  getFlaggedContent: async (): Promise<FlaggedMessage[]> => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        id,
        content,
        created_at,
        sender:profiles(name),
        flag_reason,
        flag_status,
        flag_severity
      `,
      )
      .eq("is_flagged", true);

    if (error) throw new Error(error.message);

    return data.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender.name,
      timestamp: new Date(msg.created_at).toLocaleString(),
      reason: msg.flag_reason,
      status: msg.flag_status,
      severity: msg.flag_severity,
    }));
  },

  getUsageMetrics: async () => {
    // This would typically call a database function or stored procedure
    // that aggregates metrics data
    const { data, error } = await supabase.rpc("get_platform_metrics");

    if (error) throw new Error(error.message);

    return data;
  },
};
