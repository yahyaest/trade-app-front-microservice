/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';


const socialMedia = [
    {
        id: 1,
        img: "/images/git.svg",
        link: "https://github.com/yahyaest",
    },
    {
        id: 2,
        img: "/images/link.svg",
        link: "https://www.linkedin.com/in/machat-yahya-0667b2149/",
    },
];

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer p-3">
            <div className="font-medium">© 2024 All In One Trade Simulator </div>
            <div className="flex items-center" style={{position: "absolute", right: "10px"}}>
            {socialMedia.map((info) => (
                <a
                key={info.id}
                className="w-10 h-10 mx-1 p-1 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-cyan-400"
                style={{ borderRadius: "25%"}}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                >
                    <img src={info.img} alt="icons" width={20} height={20} />
                </a>
            ))}
            </div>
        </div>
    );
};

export default AppFooter;
