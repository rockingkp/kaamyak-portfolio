"use client";

import { blogLinks, projectLinks } from "@/utils/links";
import { asImageSrc, Content, isFilled } from "@prismicio/client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

type ContentListProps = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[];
  contentType: Content.ContentIndexSlice["primary"]["content_type"];
  fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"];
  viewLinkText: Content.ContentIndexSlice["primary"]["view_link_text"];
};

const ContentList = ({
  items,
  contentType,
  fallbackItemImage,
  viewLinkText = "View Blog",
}: ContentListProps) => {
  const component = useRef(null);
  const revealRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  const pathname = usePathname();

  const [currentItem, setCurrentItem] = useState<null | number>(null);

  const setItemRef = useCallback((el: HTMLLIElement | null, index: number) => {
    itemsRef.current[index] = el;
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          }
        );
      });

      return () => ctx.revert(); //cleanup
    }, component);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };

      // calculate speed and direction
      const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2));

      let ctx = gsap.context(() => {
        if (currentItem !== null) {
          const maxY = window.scrollY + window.innerHeight - 350;
          const maxX = window.innerWidth - 250;

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1),
            ease: "back.out(2)",
            duration: 1.3,
            opacity: 1,
          });
        }

        lastMousePos.current = mousePos;
        return () => ctx.revert();
      }, component);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [currentItem]);

  const contentImages = items.map((item) => {
    const image = isFilled.image(item.data.hover_image)
      ? item.data.hover_image
      : fallbackItemImage;

    return asImageSrc(image, {
      fit: "crop",
      w: 220,
      h: 320,
      exp: -10,
    });
  });

  useEffect(() => {
    contentImages.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [contentImages]);

  const onMouseEnter = (index: number) => {
    setCurrentItem(index);
  };

  const onMouseLeave = () => {
    setCurrentItem(null);
  };

  const finalViewLinkText =
    pathname === "/projects" ? "View Live Project" : viewLinkText;

  return (
    <div ref={component}>
      <ul
        className="grid border-b border-b-slate-100"
        onMouseLeave={onMouseLeave}
      >
        {pathname === "/blog" &&
          items.map((item, index) => (
            <>
              {isFilled.keyText(item.data.title) && (
                <li
                  key={index}
                  className="list-item opacity-0"
                  onMouseEnter={() => onMouseEnter(index)}
                  ref={(el) => setItemRef(el, index)}
                >
                  <Link
                    target="_blank"
                    href={blogLinks[index]?.url || "#"} // You can replace this with a dynamic URL based on `item`
                    className="flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
                    aria-label={item.data.title}
                  >
                    <div className="flex flex-col">
                      <span className="text-3xl  font-bold">
                        {item.data.title}
                      </span>
                      <div className="flex gap-2 text-yellow-400 mt-4 text-[1.3rem] font-bold lowercase ">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="mt-4">
                            {`#${tag}`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto mt-3 flex items-center gap-2 text-lg font-medium md:ml-0">
                      {viewLinkText} <MdArrowOutward />
                    </span>
                  </Link>
                </li>
              )}
            </>
          ))}
        {pathname === "/projects" &&
          items.map((item, index) => (
            <>
              {isFilled.keyText(item.data.title) && (
                <li
                  key={index}
                  className="list-item opacity-0"
                  onMouseEnter={() => onMouseEnter(index)}
                  ref={(el) => setItemRef(el, index)}
                >
                  <Link
                    target="_blank"
                    href={projectLinks[index]?.url || "#"} // You can replace this with a dynamic URL based on `item`
                    className="flex flex-col justify-between border-t border-t-slate-100 py-10 text-slate-200 md:flex-row"
                    aria-label={item.data.title}
                  >
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold">
                        {item.data.title}
                      </span>

                      <div className="flex gap-2 text-yellow-400 mt-4 text-[1.3rem] font-bold">
                        {projectLinks[index]?.description}
                      </div>
                    </div>
                    <span className="ml-auto mt-3 flex items-center gap-2 text-xl font-medium md:ml-0">
                      {finalViewLinkText} <MdArrowOutward />
                    </span>
                  </Link>
                </li>
              )}
            </>
          ))}
      </ul>

      {/* Hover Element  */}
      <div
        ref={revealRef}
        className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[320px] w-[220px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
        style={{
          backgroundImage:
            currentItem !== null ? `url(${contentImages[currentItem]})` : "",
        }}
      ></div>
    </div>
  );
};

export default ContentList;
