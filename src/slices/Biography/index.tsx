"use client";

import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Avatar from "./Avatar";
import Link from "next/link";
import Confetti from "react-dom-confetti";
import { useState } from "react";

/**
 * Props for `Biography`.
 */
export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

/**
 * Component for "Biography" Slices.
 */
const Biography = ({ slice }: BiographyProps): JSX.Element => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr]">
        <Heading as="h1" size="xl" className="col-start-1 select-none">
          {slice.primary.heading}
        </Heading>
        <div className="prose prose-xl prose-slate prose-invert col-start-1">
          I am an{" "}
          <span
            className=" text-xl font-bold inline-block "
            onMouseEnter={() => setShowConfetti(true)}
            onMouseLeave={() => setShowConfetti(false)}
            onTouchStart={() => setShowConfetti(true)}
            onTouchEnd={() => setShowConfetti(false)}
          >
            <Confetti
              active={showConfetti}
              config={{ elementCount: 200, spread: 90 }}
            />
            <Link
              className="no-underline hover:underline hover:text-yellow-300 transition-transform duration-300 text-blue-400 cursor-pointer"
              href="https://www.credly.com/badges/7897e5db-8dce-4b35-b95e-d0ecaa91f044/public_url"
              target="_blank"
            >
              AWS certified Solutions Architect Associate
            </Link>{" "}
          </span>{" "}
          and a full stack developer with proven track record in creating and
          optimizing end-to-end solutions.
          <br />
          <br />
          My expertise spans across front-end and back-end technologies ,
          <span className="text-xl font-medium inline-block text-blue-400 ">
            learning by making projects
          </span>{" "}
          and build robust, scalable applications. With experience in diverse
          projects, I am dedicated to leveraging the latest technologies to
          deliver impactful and efficient software solutions. <br />
          <br />
          Join me as I push the boundaries of what&apos;s possible in the
          digital world, adopting best coding practices and{" "}
          <span className="text-xl font-medium inline-block text-blue-400 ">
            writing clean and efficient code !
          </span>
        </div>
        <Button
          linkField={slice.primary.button_link}
          label={slice.primary.button_text}
        />

        <Avatar
          image={slice.primary.avatar}
          className="row-start-1 max-w-sm md:col-start-2 md:row-end-3"
        />
      </div>
    </Bounded>
  );
};

export default Biography;
