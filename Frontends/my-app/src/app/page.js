"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import "./globals.css";
 
export default function Home() {
  return (
    <div className="text-center mt-10 flex flex-col justify-center items-center">
      <motion.div
        initial={{ x: -100, opacity: 0 }}  // Start left and invisible
        animate={{ x: 0, opacity: 1 }}     // End at center and fully visible
        transition={{ duration: 1.5, ease: "easeOut" }}  // Smooth animation
      >
        <h1 className="text-3xl max-w-[33%]">
          Hello World! How are you guys? Today we are starting to build the frontend project for{" "}
          <span className="font-bold text-blue-500">GameNation</span>.
        </h1>
      </motion.div>
    </div>
  );
}
