import React, { useState, useEffect, useRef } from "react";
import { X, HelpCircle, ChevronRight, Loader2 } from "lucide-react";
import logo from "../../assets/image/logo-english.jpg"; // Replace with your Cholimex logo path
import axios from "axios";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  const API = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 10000,
  });

  const predefinedQuestions = [
    {
      id: "product_safety",
      text: "Sản phẩm có an toàn và chất lượng không?",
      subQuestions: [
        { id: "product_ingredients", text: "Thành phần sản phẩm là gì?" },
        {
          id: "product_certification",
          text: "Có chứng nhận an toàn thực phẩm không?",
        },
      ],
    },
    {
      id: "product_price",
      text: "Giá thành sản phẩm?",
      subQuestions: [
        {
          id: "max_discount_amount",
          text: "Giảm giá tối đa được bao nhiêu %?",
        },
        {
          id: "special_offers",
          text: "Có ưu đãi đặc biệt nào cho sản phẩm không?",
        },
      ],
    },
    {
      id: "promo_points",
      text: "Mã khuyến mãi và điểm tích lũy?",
      subQuestions: [
        {
          id: "active_promo_codes",
          text: "Có mã khuyến mãi nào đang áp dụng không?",
        },
        { id: "points_usage", text: "Làm sao để tích lũy và sử dụng điểm?" },
      ],
    },
    {
      id: "delivery",
      text: "Giao hàng mất bao lâu?",
      subQuestions: [
        { id: "delivery_fees", text: "Phí giao hàng là bao nhiêu?" },
        { id: "delivery_tracking", text: "Làm sao để theo dõi đơn hàng?" },
      ],
    },
    {
      id: "storage",
      text: "Làm sao để bảo quản sản phẩm?",
      subQuestions: [
        { id: "shelf_life", text: "Hạn sử dụng của sản phẩm là bao lâu?" },
        { id: "storage_instructions", text: "Hướng dẫn bảo quản chi tiết?" },
      ],
    },
    {
      id: "customer_support",
      text: "Liên hệ hỗ trợ khách hàng như thế nào?",
      subQuestions: [
        { id: "support_contact", text: "Số hotline hoặc email hỗ trợ?" },
        { id: "support_hours", text: "Thời gian hỗ trợ là khi nào?" },
      ],
    },
    {
      id: "return_policy",
      text: "Chính sách đổi trả ra sao?",
      subQuestions: [
        { id: "return_conditions", text: "Điều kiện để đổi trả sản phẩm?" },
        { id: "return_process", text: "Quy trình đổi trả như thế nào?" },
      ],
    },
  ];

  const toggleChat = () => {
    console.log("Toggling chat, current isOpen:", isOpen);
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessages([
        {
          text: "Xin chào! Tôi là trợ lý của Cholimex. Vui lòng chọn một câu hỏi để bắt đầu!",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setSelectedQuestion(null);
    }
  };

  const handleQuestionClick = async (
    questionId,
    isSubQuestion = false,
    event
  ) => {
    console.log(
      "Handling question click:",
      questionId,
      "isSubQuestion:",
      isSubQuestion
    );
    event.stopPropagation();
    event.preventDefault();

    const question = isSubQuestion
      ? predefinedQuestions
          .flatMap((q) => q.subQuestions)
          .find((sq) => sq.id === questionId)
      : predefinedQuestions.find((q) => q.id === questionId);

    if (!question) {
      console.error("Question not found:", questionId);
      setMessages((prev) => [
        ...prev,
        {
          text: "Câu hỏi không hợp lệ. Vui lòng thử lại.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending API request for:", questionId);
      const response = await API.post("/webhook", {
        queryResult: { queryText: questionId },
      });
      console.log("API response:", response.data);

      if (!response.data.fulfillmentText && !response.data.products) {
        throw new Error("No fulfillment text or products received");
      }

      const botMessage = {
        text: response.data.fulfillmentText,
        products: response.data.products,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        console.log("Updating messages with:", question.text, botMessage);
        return [
          ...prev,
          { text: question.text, sender: "user", timestamp: new Date() },
          botMessage,
        ];
      });

      if (!isSubQuestion) {
        setSelectedQuestion(question);
      }
    } catch (error) {
      console.error("Error sending question:", error.message, error.stack);
      const errorMessage = {
        text: "Có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      console.log("Scrolling chat to bottom");
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    } else {
      console.log("chatRef is null");
    }
  }, [messages]);

  console.log("Rendering ChatBot, isOpen:", isOpen, "messages:", messages);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
     <div className="fixed bottom-13 right-6 transform -translate-y-1/2">
  {!isOpen && (
    <button
      onClick={toggleChat}
      className="group bg-[#dd3333] text-white p-3 rounded-full shadow-xl hover:bg-[#b52828] transition-all duration-300 flex items-center justify-center transform hover:scale-110 w-16 h-16"
    >
      <img src={logo} alt="Cholimex Chat" className="w-10 h-10 " />
    </button>
  )}
</div>

      {isOpen && (
        <div className="bg-white w-full max-w-[400px] sm:max-w-[450px] h-[650px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="flex items-center justify-between p-4 bg-[#dd3333] text-white">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Cholimex Logo" className="w-8 h-8" />
              <h3 className="font-semibold text-lg tracking-tight">
                Trợ lý Cholimex
              </h3>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-[#b52828] p-2 rounded-full transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={chatRef}
            className="flex-1 p-5 overflow-y-auto bg-[#f9f9f9] space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-[#dd3333] text-white ml-auto rounded-br-none"
                    : "bg-white mr-auto rounded-bl-none border border-gray-200"
                } shadow-sm`}
              >
                {msg.text && (
                  <p className="text-sm leading-relaxed text-gray-800">
                    {msg.text}
                  </p>
                )}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {msg.products.map((product, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform duration-200"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.ProductName}
                          className="w-24 h-24 object-contain rounded-md mb-2"
                          onError={(e) => {
                            e.target.src = logo; // Fallback to logo if image fails
                          }}
                        />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-800">
                            {product.ProductName}
                          </p>
                          {product.Ingredients && (
                            <p className="text-xs text-gray-600">
                              Thành phần: {product.Ingredients}
                            </p>
                          )}
                          {product.Price && (
                            <p className="text-xs text-gray-600">
                              Giá: {product.Price} VND
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-xs text-gray-400 block mt-2 opacity-80">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="animate-spin text-[#dd3333]" size={28} />
              </div>
            )}

            {!selectedQuestion && !isLoading && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-3 text-sm">
                  Chọn câu hỏi:
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {predefinedQuestions.map((q) => (
                    <button
                      key={q.id}
                      onClick={(e) => handleQuestionClick(q.id, false, e)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white text-gray-800 rounded-lg hover:bg-[#dd3333] hover:text-white transition-all duration-200 text-sm font-medium shadow-sm border border-gray-200"
                    >
                      <span className="truncate">{q.text}</span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedQuestion && !isLoading && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-3 text-sm">
                  Chọn câu hỏi chi tiết cho "{selectedQuestion.text}":
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedQuestion.subQuestions.map((sq) => (
                    <button
                      key={sq.id}
                      onClick={(e) => handleQuestionClick(sq.id, true, e)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white text-gray-800 rounded-lg hover:bg-[#dd3333] hover:text-white transition-all duration-200 text-sm font-medium shadow-sm border border-gray-200"
                    >
                      <span className="truncate">{sq.text}</span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      console.log("Returning to main questions");
                      setSelectedQuestion(null);
                    }}
                    className="mt-2 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm font-medium shadow-sm"
                  >
                    Quay lại
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
