import { useEffect, useRef } from "react";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const ProductSwiper = ({ images }: any) => {
    const swiperRef = useRef<any>(null);

    useEffect(() => {
        swiperRef.current?.swiper?.autoplay.stop();
    }, [swiperRef]);

    return (
        <div
            className="relative w-52"
            onMouseEnter={() => {
                swiperRef.current?.swiper?.autoplay.start();
            }}
            onMouseLeave={() => {
                swiperRef.current?.swiper?.autoplay.stop();
                swiperRef.current?.swiper?.slideTo(0);
            }}
        >
            <Swiper
                ref={swiperRef}
                centeredSlides={true}
                autoplay={{ delay: 100, stopOnLastSlide: false }}
                speed={500}
                modules={[Autoplay]}
            >
                {images.map((img: any, i: number) => (
                    <SwiperSlide key={i}>
                        <div className="z-10 rounded flex items-center justify-center bg-white w-[220px] h-[300px]">
                            <img
                                src={img.url}
                                className="rounded w-auto h-auto object-cover"
                                alt="imgswiper"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductSwiper;
