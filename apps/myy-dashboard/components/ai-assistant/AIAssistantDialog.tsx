"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { IconSend, IconRobot, IconUser } from "@tabler/icons-react";

// 消息类型
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// 默认欢迎消息
const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content: "您好！我是您的园林助手，可以回答您关于植物养护、销售和管理的问题。请问有什么可以帮助您的？",
  timestamp: new Date(),
};

// 常见问题建议
const suggestions = [
  "如何处理红枫叶片发黄的问题？",
  "最适合北方种植的常绿树种有哪些？",
  "如何提高苗木销售转化率？",
  "园林项目的报价应该如何计算？",
];

type AIAssistantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AIAssistantDialog({ open, onOpenChange }: AIAssistantDialogProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_MESSAGES = 50; // 最大消息数量限制

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 当对话框打开时，聚焦输入框
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 这里应该是调用AI API的地方
      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟AI回复
      const response = generateMockResponse(input);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      // 限制消息数量，保留最新的MAX_MESSAGES条消息
      setMessages((prev) => {
        const newMessages = [...prev, assistantMessage];
        if (newMessages.length > MAX_MESSAGES) {
          // 始终保留欢迎消息
          return [welcomeMessage, ...newMessages.slice(-(MAX_MESSAGES - 1))];
        }
        return newMessages;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      
      // 添加错误消息
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "抱歉，我遇到了一些问题。请稍后再试。",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2 flex justify-between items-center">
          <DialogTitle className="flex items-center">
            <IconRobot className="mr-2 h-5 w-5 text-primary" />
            园林AI助手
          </DialogTitle>
          {messages.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMessages([welcomeMessage])}
              className="text-xs"
            >
              清除对话
            </Button>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 overflow-auto max-h-[calc(600px-120px)]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "assistant"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <div className="mr-2 mt-1 flex-shrink-0">
                    {message.role === "assistant" ? (
                      <IconRobot className="h-4 w-4" />
                    ) : (
                      <IconUser className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    <p className="mt-1 text-xs opacity-50">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">您可以尝试问我：</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 text-sm"
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start mt-4">
              <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的问题..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <IconSend className="h-4 w-4" />
              <span className="sr-only">发送</span>
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 模拟AI回复生成
function generateMockResponse(question: string): string {
  const responses: Record<string, string> = {
    "如何处理红枫叶片发黄的问题？": 
      "红枫叶片发黄通常有几个常见原因：\n\n1. 浇水不当：过多或过少的水分都会导致叶片发黄。保持土壤湿润但不积水。\n\n2. 光照问题：红枫喜欢半阴环境，强烈的阳光直射会导致叶片灼伤。\n\n3. 养分不足：可以适当施加含铁、氮的肥料。\n\n4. 病虫害：检查叶片背面是否有虫害，必要时使用适当的药剂防治。\n\n建议先调整浇水频率和光照条件，如情况没有改善，可以考虑施肥或咨询专业园艺师。",
    
    "最适合北方种植的常绿树种有哪些？": 
      "适合北方种植的常绿树种包括：\n\n1. 侧柏：耐寒性强，适应性广，是北方地区常见的绿化树种。\n\n2. 油松：耐寒、耐旱、耐瘠薄，是华北地区重要的造林树种。\n\n3. 雪松：观赏价值高，耐寒性较好，适合北方庭院种植。\n\n4. 冬青：叶片四季常绿，有多个耐寒品种可选。\n\n5. 黄杨：适应性强，可修剪成各种形状，北方多作绿篱使用。\n\n6. 龙柏：耐寒耐旱，树形优美，是北方地区优良的园林绿化树种。\n\n选择时应考虑当地的具体气候条件和土壤情况。",
    
    "如何提高苗木销售转化率？": 
      "提高苗木销售转化率的策略：\n\n1. 提供详细的植物信息：包括生长特性、养护要求和应用场景，帮助客户做出明智决定。\n\n2. 展示成功案例：通过照片或视频展示植物在实际景观中的效果。\n\n3. 提供售后服务：包括种植指导、养护建议和问题解决方案。\n\n4. 季节性促销：根据不同季节推出适合种植的苗木促销活动。\n\n5. 建立客户关系管理系统：记录客户偏好，提供个性化推荐。\n\n6. 专业培训销售人员：确保他们能够回答客户的专业问题。\n\n7. 提供植物组合方案：帮助客户规划整体景观效果。",
    
    "园林项目的报价应该如何计算？": 
      "园林项目报价计算方法：\n\n1. 材料成本：\n   - 植物材料（按规格、数量计算）\n   - 土壤、肥料、园艺资材\n   - 硬质景观材料（石材、木材等）\n\n2. 人工成本：\n   - 设计费用\n   - 施工人员工资\n   - 专业技术人员费用\n\n3. 设备成本：\n   - 机械租赁或折旧\n   - 工具使用费\n\n4. 管理费用：项目管理、监理等\n\n5. 间接成本：保险、税费、运输等\n\n6. 利润率：通常为总成本的15-30%\n\n建议使用专业园林预算软件，并根据项目规模、复杂度、地理位置等因素进行调整。详细的现场勘察也是准确报价的关键。",
  };

  // 检查是否有匹配的预设问题
  for (const key in responses) {
    if (question.includes(key)) {
      return responses[key];
    }
  }

  // 默认回复
  return "感谢您的提问。这是一个很好的问题，但我目前没有足够的信息来提供准确的回答。建议您咨询我们的专业园艺师或查阅相关资料获取更详细的信息。您还有其他问题吗？";
}
