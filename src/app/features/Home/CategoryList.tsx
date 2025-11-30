import ScrollArrow from "../../components/ScrollArrow.tsx";
import {Loader} from "../../components/Loader.tsx";
import {useScrollArrows} from "./hooks/useScrollArrows.ts";
import {useCategories} from "../../../infrastructure/services/CategoryService.ts";
import {useNavigate} from "react-router-dom";

export function CategoryList() {

    const { categories, isLoading, error } = useCategories();

    const navigate = useNavigate();

    const { scrollRef, showLeft, showRight, onScroll, scroll } = useScrollArrows([categories, isLoading]);

    return (
        <div className="relative mt-6 mb-8 sm:mt-10 sm:mb-12">
            <div className="relative px-2 sm:px-6 md:px-12">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden sm:block">
                    <ScrollArrow direction="left" onClick={() => scroll("left")} isVisible={showLeft} />
                </div>
                <div
                    ref={scrollRef}
                    className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scroll-smooth px-2 sm:px-4 md:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    onScroll={onScroll}
                >
                    {isLoading ? (

                        <div className="min-h-screen flex items-center justify-center bg-[#f4f0f7]">
                            <Loader size="md" color="primary" />
                        </div>
                    ) : error ? (
                        <p className="text-red-500">Error al cargar categorías</p>
                    ) : (
                        categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => navigate(`/explore?categoryIds=${category.id}`)}
                                className="flex-shrink-0 bg-[#5C17A6] text-white hover:bg-[#4a186f] cursor-pointer px-3 py-2 sm:px-6 sm:py-3 rounded-full shadow-sm transition font-medium min-w-[90px] sm:min-w-[120px] md:min-w-[140px] text-xs sm:text-base"
                            >
                                {category.name}
                            </button>
                        ))
                    )}
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden sm:block">
                    <ScrollArrow direction="right" onClick={() => scroll("right")} isVisible={showRight} />
                </div>
            </div>
        </div>
    );
}