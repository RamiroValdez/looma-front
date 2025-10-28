import React from 'react';

type Props = {
    children?: React.ReactNode;
    topContent?: React.ReactNode;
    className?: string;
};

export default function LayeredCard({ children, topContent, className }: Props) {
    return (
        <div className={`relative max-w-md mx-auto ${className || ''}`}>
            <div className="bg-[#CDBBE1] rounded-xl">
                <div className="w-full bg-[#172FA6] rounded-xl h-44 shadow-inner relative">
                    {topContent && (
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%]">
                            {topContent}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
