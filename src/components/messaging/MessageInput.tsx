import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Image, Paperclip, Smile, Send, Mic } from "lucide-react";

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  onAttachMedia?: (file: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput = ({
  onSendMessage = () => {},
  onAttachMedia = () => {},
  disabled = false,
  placeholder = "Type a message...",
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAttachMedia(files[0]);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop audio recording
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t bg-white w-full">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,video/*"
      />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={disabled}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Attach file</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              disabled={disabled}
            >
              <Image className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send image</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={disabled}
              >
                <Smile className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add emoji</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`text-gray-500 hover:text-gray-700 ${isRecording ? "text-red-500 hover:text-red-700" : ""}`}
              onClick={toggleRecording}
              disabled={disabled}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isRecording ? "Stop recording" : "Start voice recording"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="primary"
              size="icon"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
              onClick={handleSendMessage}
              disabled={disabled || !message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MessageInput;
