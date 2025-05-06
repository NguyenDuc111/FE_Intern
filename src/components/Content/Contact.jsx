import CholimexLayout from "../Layout/CholimexLayout";

function Contact() {
  return (
    <CholimexLayout>
      <div className="min-h-[60vh] flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            Hệ thống đang phát triển thêm!
          </h1>
          <p className="text-gray-600 text-lg">
            Xin lỗi vì sự bất tiện này. Chúng tôi đang nâng cấp tính năng liên hệ để phục vụ bạn tốt hơn trong thời gian tới.
          </p>
        </div>
      </div>
    </CholimexLayout>
  );
}

export default Contact;
