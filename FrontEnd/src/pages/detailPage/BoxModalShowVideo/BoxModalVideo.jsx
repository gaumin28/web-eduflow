import { useState } from "react";
import { Flex, Modal } from "antd";

const BoxModalVideo = ({ videoLink }) => {
  const [open, setOpen] = useState(false);
  return (
    <Flex vertical gap="middle" align="flex-start">
      {/* Responsive */}
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur(); // 👈 bỏ focus
          setOpen(true);
        }}
        className="absolute inset-0 bg-on-background/20 flex items-center justify-center"
      >
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
          <span
            className="material-symbols-outlined text-on-background text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_arrow
          </span>
        </div>
      </button>
      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "40%",
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-[14px] md:text-[16px] lg:text-[18px] text-[#000000] font-bold">
            Xem trước khóa học
          </h1>
          <iframe
            className="w-full h-78.75 rounded-md"
            src={`${videoLink}&autoplay=1&mute=1`}
            title="YouTube video"
            allow="autoplay; encrypted-media"
            tabIndex="-1"
          ></iframe>
        </div>
      </Modal>
    </Flex>
  );
};
export default BoxModalVideo;
