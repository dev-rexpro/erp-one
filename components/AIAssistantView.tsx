

import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/geminiService';
import { SparklesIcon, XIcon } from '../constants';
import { ArrowUp, Paperclip, Search, BookCheck, FileCode, Copy, Check, RefreshCw, Image as ImageIcon, FileText, File as FileIcon } from 'lucide-react';

declare const pdfjsLib: any;

interface AttachedFileData {
    name: string;
    data: string; // base64 string
    mimeType: string;
    extractedText?: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  image?: string; // data URL for preview
  file?: AttachedFileData | null; // Full file data for conversational context
}

const AIAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<AttachedFileData | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';
    }
  }, []);

  const quickPrompts = [
    { icon: <Search className="h-4 w-4 mr-2" />, text: "Find HS Code for 'frozen shrimp'" },
    { icon: <BookCheck className="h-4 w-4 mr-2" />, text: "What are the import requirements for electronics from China?" },
    { icon: <FileCode className="h-4 w-4 mr-2" />, text: "Draft a simple Bill of Lading" },
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node)) {
        setIsAttachmentMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText;
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsAttachmentMenuOpen(false);
    if (e.target) e.target.value = ''; // Allow re-selecting

    if (file.type === 'application/pdf') {
        setIsLoading(true);
        setStatusMessage('Parsing PDF...');
        try {
            const text = await extractTextFromPdf(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setAttachedFile({
                    name: file.name,
                    data: base64String,
                    mimeType: file.type,
                    extractedText: text,
                });
                setStatusMessage(null);
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error("PDF Parsing Error:", err);
            setStatusMessage('Could not read PDF. It may be corrupted.');
            setIsLoading(false);
        }
    } else {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setAttachedFile({
                name: file.name,
                data: base64String,
                mimeType: file.type,
            });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSend = async (prompt: string = input) => {
    if ((!prompt.trim() && !attachedFile) || isLoading) return;

    const userMessage: Message = { 
        sender: 'user', 
        text: prompt,
        file: attachedFile,
    };
    if (attachedFile) {
        userMessage.image = `data:${attachedFile.mimeType};base64,${attachedFile.data}`;
    }

    const newHistory = [...messages, userMessage];

    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    setStatusMessage(null);
    setAttachedFile(null); // Clear from input area

    try {
      const aiText = await getAIResponse(newHistory);
      const aiMessage: Message = { sender: 'ai', text: aiText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setStatusMessage(errorMessage);
      setMessages(prev => [...prev, { sender: 'ai', text: `Sorry, I encountered an error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000); // Reset after 2 seconds
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
  };
  
  const handleNewChat = () => {
    setMessages([]);
    setStatusMessage(null);
    setAttachedFile(null);
    setInput('');
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };
  
  const formatResponse = (text: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) { // This is a code block
        return <pre key={index} className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200 rounded-md p-4 my-2 overflow-x-auto text-sm"><code>{part.trim()}</code></pre>;
      } else {
        return <div key={index} dangerouslySetInnerHTML={{__html: part.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}}/>
      }
    });
  };
  
  const renderAttachmentPreview = () => {
    if (!attachedFile) return null;
    
    if (attachedFile.mimeType.startsWith('image/')) {
        return (
             <div className="relative inline-block align-middle">
                <img src={`data:${attachedFile.mimeType};base64,${attachedFile.data}`} alt={attachedFile.name} className="h-16 w-16 object-cover rounded-md" />
                <button 
                    onClick={() => setAttachedFile(null)} 
                    className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full p-0.5 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    aria-label="Remove attachment"
                >
                    <XIcon className="h-4 w-4" />
                </button>
            </div>
        );
    } 
    
    let icon;
    if (attachedFile.mimeType === 'application/pdf') {
        icon = <FileCode className="h-8 w-8 text-red-500" />;
    } else if (attachedFile.mimeType.startsWith('text/')) {
        icon = <FileText className="h-8 w-8 text-blue-500" />;
    } else {
        icon = <FileIcon className="h-8 w-8 text-gray-500" />;
    }

    return (
        <div className="relative flex items-center space-x-3 rounded-md border border-gray-300 bg-gray-100 p-2 dark:bg-gray-600 dark:border-gray-500">
            {icon}
            <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{attachedFile.name}</span>
            <button
                onClick={() => setAttachedFile(null)}
                className="ml-auto flex-shrink-0 rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-500"
                aria-label="Remove attachment"
            >
                <XIcon className="h-4 w-4" />
            </button>
        </div>
    );
  };

  const renderMessageAttachment = (msg: Message) => {
    if (!msg.image) return null;

    const mimeType = msg.image.substring(msg.image.indexOf(':') + 1, msg.image.indexOf(';'));

    if (mimeType.startsWith('image/')) {
      return <img src={msg.image} alt="User attachment" className="rounded-md mb-2 max-h-60" />;
    }

    let icon, text;
    const isUser = msg.sender === 'user';
    const wrapperClasses = isUser ? 'bg-gray-800 border-gray-600' : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600';
    const textClasses = isUser ? 'text-gray-200' : 'text-gray-700 dark:text-gray-200';
    const iconClasses = isUser ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400';

    if (mimeType === 'application/pdf') {
      icon = <FileCode className={`h-5 w-5 mr-2 ${iconClasses}`} />;
      text = 'PDF Document';
    } else if (mimeType.startsWith('text/')) {
      icon = <FileText className={`h-5 w-5 mr-2 ${iconClasses}`} />;
      text = 'Text Document';
    } else {
      icon = <FileIcon className={`h-5 w-5 mr-2 ${iconClasses}`} />;
      text = 'Attached File';
    }

    return (
      <div className={`flex items-center rounded-md p-2 mb-2 border ${wrapperClasses}`}>
        {icon}
        <span className={`text-sm font-medium ${textClasses}`}>{text}</span>
      </div>
    );
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 pt-4">
            {messages.length === 0 && (
              <div className="text-center my-12">
                <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <SparklesIcon className="h-10 w-10 text-gray-600 dark:text-gray-300" />
                </div>
                <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">System Intelligence</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Your specialized expert in export-import logistics, powered by REX AI.</p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quickPrompts.map((prompt) => (
                    <button key={prompt.text} onClick={() => handleQuickPrompt(prompt.text)} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      {prompt.icon} {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length > 0 && (
                 <div className="sticky top-0 z-10 -mx-4 mb-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 backdrop-blur-sm">
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Conversation</h1>
                    <button 
                        onClick={handleNewChat} 
                        className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span>New Chat</span>
                    </button>
                 </div>
            )}

            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'ai' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">AI</div>}
                  <div className={`relative group max-w-xl rounded-lg p-4 ${msg.sender === 'user' ? 'bg-black text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                    {renderMessageAttachment(msg)}
                    <div className="prose prose-sm max-w-none dark:text-gray-200">{formatResponse(msg.text)}</div>
                    {msg.sender === 'ai' && (
                        <button
                            onClick={() => handleCopy(msg.text, index)}
                            aria-label="Copy response"
                            className="absolute top-2 right-2 p-1 rounded-md bg-gray-200/50 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-300 dark:bg-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-500"
                        >
                            {copiedStates[index] ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                    )}
                  </div>
                  {msg.sender === 'user' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm">JD</div>}
                </div>
              ))}
              {isLoading && !statusMessage && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">AI</div>
                  <div className="max-w-xl rounded-lg p-4 bg-gray-100 dark:bg-gray-700 text-gray-800">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
        <div className="mt-auto px-4 pt-2 pb-4">
          <div className="mx-auto max-w-4xl">
             {statusMessage && (
                <div className="mb-2 text-center text-sm text-red-600">
                    {statusMessage}
                </div>
             )}
            <div className="flex flex-col rounded-lg border-2 border-gray-300 bg-white focus-within:border-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:focus-within:border-gray-400">
              {attachedFile && (
                  <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-md dark:border-gray-600 dark:bg-gray-600">
                      {renderAttachmentPreview()}
                  </div>
              )}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={isLoading && statusMessage ? statusMessage : "Ask System Intelligence anything, or attach a file to get started."}
                className="w-full resize-none border-0 bg-transparent p-4 text-sm focus:outline-none focus:ring-0 dark:text-gray-200 dark:placeholder:text-gray-400"
                rows={1}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between px-3 py-1.5">
                 <div className="relative" ref={attachmentMenuRef}>
                    <input 
                        type="file" 
                        ref={imageInputRef} 
                        onChange={handleFileAttach} 
                        className="hidden" 
                        accept="image/*"
                    />
                    <input 
                        type="file" 
                        ref={textInputRef} 
                        onChange={handleFileAttach} 
                        className="hidden" 
                        accept="text/plain"
                    />
                    <input 
                        type="file" 
                        ref={pdfInputRef} 
                        onChange={handleFileAttach} 
                        className="hidden" 
                        accept="application/pdf"
                    />
                    <button 
                        onClick={() => setIsAttachmentMenuOpen(prev => !prev)}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600" 
                        aria-label="Attach file"
                        disabled={isLoading}
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>

                    {isAttachmentMenuOpen && (
                        <div className="absolute bottom-full z-20 mb-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <button onClick={() => { imageInputRef.current?.click(); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" role="menuitem">
                                    <ImageIcon className="mr-3 h-5 w-5 text-gray-400" />
                                    <span>Upload Image</span>
                                </button>
                                <button onClick={() => { textInputRef.current?.click(); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" role="menuitem">
                                    <FileText className="mr-3 h-5 w-5 text-gray-400" />
                                    <span>Upload text file</span>
                                </button>
                                <button onClick={() => { pdfInputRef.current?.click(); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" role="menuitem">
                                    <FileCode className="mr-3 h-5 w-5 text-gray-400" />
                                    <span>Upload PDF</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || (!input.trim() && !attachedFile)}
                  className="rounded-md bg-black p-2 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-gray-500"
                  aria-label="Send message"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistantView;