import Category from "@/models/Category";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";
import db from "@/utils/db";
import { filterArray, removeDublicates, randomize } from "@/utils/array_utils";
import Header from "@/components/Header/Header";
import Link from "next/link";
import ProductCard from "@/components/Home/productCard/ProductCard";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import CategoriesFilter from "@/components/browse/categoriesFilter/CategoriesFilter";
import SizesFilter from "@/components/browse/sizesFilter/SizesFilter";
import ColorsFilter from "@/components/browse/colorsFilter/ColorsFilter";
import BrandsFilter from "@/components/browse/brandsFilter/BrandsFilter";
import StylesFilter from "@/components/browse/stylesFilter/StylesFilter";
import MaterialsFilter from "@/components/browse/materialsFilter/MaterialsFilter";
import GenderFilter from "@/components/browse/genderFilter/GenderFilter";
import HeadingFilter from "@/components/browse/headingFilter/HeadingFilter";
import { useRouter } from "next/router";
import { Pagination } from "@mui/material";
import { useEffect, useRef, useState } from "react";
// import DotLoaderSpinner from "@/components/loaders/dotLoader/DotLoaderSpinner";

const Browse = ({
    categories,
    subCategories,
    products,
    sizes,
    colors,
    brands,
    styles,
    materials,
    paginationCount,
}: any) => {
    const router = useRouter();
    // const [loading, setloading] = useState(false);

    const filter = ({
        search,
        category,
        brand,
        style,
        size,
        color,
        material,
        gender,
        price,
        shipping,
        rating,
        sort,
        page,
    }: any) => {
        const path = router.pathname;
        const { query } = router;

        if (search) query.search = search;
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (style) query.style = style;
        if (size) query.size = size;
        if (color) query.color = color;
        if (material) query.material = material;
        if (gender) query.gender = gender;
        if (price) query.price = price;
        if (shipping) query.shipping = shipping;
        if (rating) query.rating = rating;
        if (sort) query.sort = sort;
        if (page) query.page = page;
        console.log("price > ", price);
        router.push({
            pathname: path,
            query: query,
        });
    };

    const searchHandler = (search: any) => {
        if (search == "") {
            filter({ search: {} });
        } else {
            filter({ search });
        }
    };
    const categoryHandler = (category: any) => {
        filter({ category });
    };
    const brandHandler = (brand: any) => {
        filter({ brand });
    };
    const styleHandler = (style: any) => {
        filter({ style });
    };
    const sizeHandler = (size: any) => {
        filter({ size });
    };
    const colorHandler = (color: any) => {
        filter({ color });
    };
    const materialHandler = (material: any) => {
        filter({ material });
    };
    const genderHandler = (gender: any) => {
        if (gender == "Unisex") {
            filter({ gender: {} });
        } else {
            filter({ gender });
        }
    };

    // function throttle(fn: any, delay: any) {
    //     let lastInvoke: any = null;
    //     console.log('throttle',delay);

    //     return (...args: any[]) => {
    //         console.log('not invoke',args[0]);
    //         if (lastInvoke + delay < Date.now()) {
    //             console.log('invoke ', args[0]);
    //             lastInvoke = Date.now();
    //             fn(args[0]);
    //         }
    //     };
    // }

    function debounce(fn: any, delay: any) {
        let timeout: any = null;
        return (...args: any) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                fn(args[0]);
            }, delay);
        };
    }

    const priceHandler = (price: any, type: any, delay: any) => {
        let priceQuery = router.query.price?.split("_") || "";
        let min = priceQuery[0] || "";
        let max = priceQuery[1] || "";
        let newPrice = "";
        if (type == "min") {
            newPrice = `${price}_${max}`;
        } else {
            newPrice = `${min}_${price}`;
        }
        let filterPrice = debounce((price: any) => filter(price), delay);
        filterPrice({ price: newPrice });
    };

    const multiPriceHandler = (min: any, max: any) => {
        filter({ price: `${min}_${max}` });
    };

    const shippingHandler = (shipping: any) => {
        filter({ shipping });
    };
    const ratingHandler = (rating: any) => {
        filter({ rating });
    };
    const sortHandler = (sort: any) => {
        if (sort == "") {
            filter({ sort: {} });
        } else {
            filter({ sort });
        }
    };
    const pageHandler = (e: any, page: any) => {
        filter({ page });
    };

    const replaceQuery = (queryName: any, value: any) => {
        const existedQeury = router.query[queryName];
        const valueCheck = existedQeury?.search(value);
        const _check = existedQeury?.search(`_${value}`);
        let result = null;
        if (existedQeury) {
            if (existedQeury == value) {
                result = {};
            } else {
                if (valueCheck !== -1) {
                    // if filtered value is in query & we want to remove it.
                    if (_check !== -1) {
                        // last
                        result = existedQeury?.replace(`_${value}`, "");
                    } else if (valueCheck == 0) {
                        // first
                        result = existedQeury?.replace(`${value}_`, "");
                    } else {
                        // middle
                        result = existedQeury?.replace(value, "");
                    }
                } else {
                    // if filtered value doesn't exist in Query & we wan to add it.
                    result = `${existedQeury}_${value}`;
                }
            }
        } else {
            result = value;
        }

        return {
            result,
            active: existedQeury && valueCheck !== -1 ? true : false,
        };
    };
    // ----------------------------------------
    const [scrollY, setScrollY] = useState(0);
    const [height, setHeight] = useState(0);
    const headerRef = useRef(null);
    const el = useRef(null);
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        setHeight(
            headerRef.current?.offsetHeight + el.current?.offsetHeight + 50
        );

        return () => {
            {
                window.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    return (
        <>
            {/* {loading && <DotLoaderSpinner loading={loading} />} */}
            <Header title={"Browse Products"} searchHandler={searchHandler} />
            <div className="max-w-screen-2xl mx-auto bg-slate-100 p-1 md:p-6 gap-2">
                <div ref={headerRef}>
                    <div className="flex items-center text-sm">
                        <span className="text-slate-700">Home</span>
                        <ChevronRightIcon className="w-4 h-4 mx-1 fill-slate-600 " />
                        <span className="text-slate-700">Browse</span>
                        {router.query?.category !== "" && (
                            <>
                                <ChevronRightIcon className="w-4 h-4 mx-1 fill-slate-600 " />
                                <span className="text-slate-700">
                                    {
                                        categories.find(
                                            (x: any) =>
                                                x._id == router.query.category
                                        )?.name
                                    }
                                </span>
                            </>
                        )}
                    </div>

                    <div
                        ref={el}
                        className="mt-2 flex flex-wrap gap-3 flex-wrap"
                    >
                        {categories.map((c: any) => (
                            <span
                                onClick={() => categoryHandler(c._id)}
                                className={`cursor-pointer flex items-center justify-center w-40 md:w-56 h-10 border bg-white rounded  transition-all duration-300 hover:bg-amazon-blue_light hover:text-white hover:scale-95 hover:border-amazon-blue_dark`}
                                key={c._id}
                            >
                                {c.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative mt-4 grid grid-cols-5 gap-1 md:gap-5">
                    <div
                        className={`h-[680px] col-span-5 md:col-span-1 flex flex-col md:items-center  overflow-y-auto overflow-x-hidden ${
                            scrollY >= height
                                ? "md:fixed md:w-[274px] md:top-2"
                                : ""
                        }`}
                    >
                        <button
                            onClick={() => router.push("/browse")}
                            className={`flex items-center justify-center w-56 md:w-full py-2 rounded transition-all duration-300 bg-amazon-blue_light text-white hover:scale-95 border-amazon-blue_dark`}
                        >
                            Clear All ({Object.keys(router.query).length})
                        </button>
                        <CategoriesFilter
                            categories={categories}
                            subCategories={subCategories}
                            categoryHandler={categoryHandler}
                            replaceQuery={replaceQuery}
                        />
                        <SizesFilter
                            sizes={sizes}
                            sizeHandler={sizeHandler}
                            replaceQuery={replaceQuery}
                        />
                        <ColorsFilter
                            colors={colors}
                            colorHandler={colorHandler}
                            replaceQuery={replaceQuery}
                        />
                        <BrandsFilter
                            brands={brands}
                            brandHandler={brandHandler}
                            replaceQuery={replaceQuery}
                        />
                        <StylesFilter
                            styles={styles}
                            styleHandler={styleHandler}
                            replaceQuery={replaceQuery}
                        />
                        <MaterialsFilter
                            materials={materials}
                            materialHandler={materialHandler}
                            replaceQuery={replaceQuery}
                        />
                        <GenderFilter
                            genderHandler={genderHandler}
                            replaceQuery={replaceQuery}
                        />
                    </div>

                    <div
                        className={`${
                            scrollY >= height ? "md:block" : "hidden"
                        } max-md:hidden md:col-span-1`}
                    ></div>

                    <div className="col-span-5 md:col-span-4 flex flex-col content-start">
                        <HeadingFilter
                            priceHandler={priceHandler}
                            multiPriceHandler={multiPriceHandler}
                            shippingHandler={shippingHandler}
                            ratingHandler={ratingHandler}
                            sortHandler={sortHandler}
                            replaceQuery={replaceQuery}
                        />
                        <div className="mt-6 flex flex-wrap items-start gap-4">
                            {products.map((product: any) => (
                                <ProductCard
                                    product={product}
                                    key={product._id}
                                />
                            ))}
                        </div>
                        <div className="w-full my-4 flex items-end justify-end">
                            <Pagination
                                count={paginationCount}
                                variant="outlined"
                                defaultPage={Number(router.query.page) || 1}
                                onChange={pageHandler}
                                size="large"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Browse;

export async function getServerSideProps(context: any) {
    const { query } = context;
    const searchQuery = query.search || "";
    const categoryQuery = query.category || "";
    const priceQuery = query.price?.split("_") || "";
    const shippingQuery = query.shipping || 0;
    const ratingQuery = query.rating || "";
    const sortQuery = query.sort || "";
    const pageSize = 10;
    const page = query.page || 1;
    // --------------------------------------------------
    const brandQuery = query.brand?.split("_") || "";
    const brandRegex = `^${brandQuery[0]}`;
    const brandSearchRegex = createRegex(brandQuery, brandRegex);
    // --------------------------------------------------
    const styleQuery = query.style?.split("_") || "";
    const styleRegex = `^${styleQuery[0]}`;
    const styleSearchRegex = createRegex(styleQuery, styleRegex);
    // --------------------------------------------------
    const sizeQuery = query.size?.split("_") || "";
    const sizeRegex = `^${sizeQuery[0]}`;
    const sizeSearchRegex = createRegex(sizeQuery, sizeRegex);
    // --------------------------------------------------
    const colorQuery = query.color?.split("_") || "";
    const colorRegex = `^${colorQuery[0]}`;
    const colorSearchRegex = createRegex(colorQuery, colorRegex);
    // --------------------------------------------------
    const materialQuery = query.material?.split("_") || "";
    const materialRegex = `^${materialQuery[0]}`;
    const materialSearchRegex = createRegex(materialQuery, materialRegex);
    // --------------------------------------------------
    // --------------------------------------------------
    const genderQuery = query.gender?.split("_") || "";
    const genderRegex = `^${genderQuery[0]}`;
    const genderSearchRegex = createRegex(genderQuery, genderRegex);
    // --------------------------------------------------
    const search =
        searchQuery && searchQuery !== ""
            ? {
                  name: {
                      $regex: searchQuery,
                      $options: "i",
                  },
              }
            : {};
    const category =
        categoryQuery && categoryQuery !== ""
            ? { category: categoryQuery }
            : {};
    // const brand = brandQuery && brandQuery !== "" ? { brand: brandQuery } : {};
    const style =
        styleQuery && styleQuery !== ""
            ? {
                  "details.value": {
                      $regex: styleSearchRegex,
                      $options: "i",
                  },
              }
            : {};
    const size =
        sizeQuery && sizeQuery !== ""
            ? {
                  "subProducts.sizes.size": {
                      $regex: sizeSearchRegex,
                      $options: "i",
                  },
              }
            : {};
    const color =
        colorQuery && colorQuery !== ""
            ? {
                  "subProducts.color.color": {
                      $regex: colorSearchRegex,
                      $options: "i",
                  },
              }
            : {};
    const brand =
        brandQuery && brandQuery !== ""
            ? {
                  brand: {
                      $regex: brandSearchRegex,
                      $options: "i",
                  },
              }
            : {};
    const material =
        materialQuery && materialQuery !== ""
            ? {
                  "details.value": {
                      $regex: materialSearchRegex,
                      $options: "i",
                  },
              }
            : {};
    const gender =
        genderQuery && genderQuery !== ""
            ? {
                  "details.value": {
                      $regex: genderSearchRegex,
                      $options: "i",
                  },
              }
            : {};
    const price =
        priceQuery && priceQuery !== ""
            ? {
                  "subProducts.sizes.price": {
                      $gte: Number(priceQuery[0]) || 0,
                      $lte: Number(priceQuery[1]) || Infinity,
                  },
              }
            : {};
    const shipping =
        shippingQuery && shippingQuery == "0"
            ? {
                  shipping: 0,
              }
            : {};
    const rating =
        ratingQuery && ratingQuery !== ""
            ? {
                  rating: {
                      $gte: Number(ratingQuery),
                  },
              }
            : {};

    const sort =
        sortQuery == ""
            ? {}
            : sortQuery == "popular"
            ? { rating: -1, "subProducts.sold": -1 }
            : sortQuery == "newest"
            ? { createdAt: -1 }
            : sortQuery == "topSelling"
            ? { "subProducts.sold": -1 }
            : sortQuery == "topReviewed"
            ? { rating: -1 }
            : sortQuery == "priceHighToLow"
            ? { "subProducts.sizes.price": -1 }
            : sortQuery == "priceLowToHight"
            ? { "subProducts.sizes.price": 1 }
            : {};
    // --------------------------------------------------
    function createRegex(data: any, styleRegex: any) {
        if (data.length > 1) {
            for (let i = 1; i < data.length; i++) {
                styleRegex += `|^${data[i]}`;
            }
        }
        return styleRegex;
    }
    // --------------------------------------------------
    db.connectDb();
    let productsDb = await Product.find({
        ...search,
        ...category,
        ...brand,
        ...style,
        ...size,
        ...color,
        ...material,
        ...gender,
        ...price,
        ...shipping,
        ...rating,
    })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort(sort)
        .lean();
    let products =
        sortQuery && sortQuery !== "" ? productsDb : randomize(productsDb);
    let categories = await Category.find().lean();
    let subCategories = await SubCategory.find()
        .populate({ path: "parent", model: Category })
        .lean();
    let colors = await Product.find({ ...category }).distinct(
        "subProducts.color.color"
    );
    let brandsDb = await Product.find({ ...category }).distinct("brand");
    let sizes = await Product.find({ ...category }).distinct(
        "subProducts.sizes.size"
    );
    let details = await Product.find({ ...category }).distinct("details");
    let stylesDb = filterArray(details, "Style");
    let materialsDb = filterArray(details, "Material");
    let styles = removeDublicates(stylesDb);
    let materials = removeDublicates(materialsDb);
    let brands = removeDublicates(brandsDb);
    let totalProducts = await Product.countDocuments({
        ...search,
        ...category,
        ...brand,
        ...style,
        ...size,
        ...color,
        ...material,
        ...gender,
        ...price,
        ...shipping,
        ...rating,
    });

    return {
        props: {
            categories: JSON.parse(JSON.stringify(categories)),
            products: JSON.parse(JSON.stringify(products)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
            sizes,
            colors,
            brands,
            styles,
            materials,
            paginationCount: Math.ceil(totalProducts / pageSize),
        },
    };
}
