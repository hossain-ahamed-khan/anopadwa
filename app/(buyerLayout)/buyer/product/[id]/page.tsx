import ProductDetailPage from "@/components/product/ProductDetails";
import productImage from "@/public/image/product-image.png";

const PRODUCT = {
    title: "2017 Toyota Camry SE Sedan",
    location: "Atwima Kwanwoma, Ashanti",
    price: "₵125,000",
};

const PRODUCT_IMAGES = Array.from({ length: 6 }, (_, index) => ({
    src: productImage.src,
    alt: `${PRODUCT.title} image ${index + 1}`,
}));

const RELATED_ADS = Array.from({ length: 4 }, (_, index) => ({
    id: `related-${index}`,
    title: PRODUCT.title,
    image: productImage.src,
    location: PRODUCT.location,
    rating: 4,
    reviewCount: 0,
    price: PRODUCT.price,
    href: `/buyer/product/related-${index}`,
    featured: true,
}));

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <ProductDetailPage
            breadcrumbs={[
                { label: "Home", href: "/buyer" },
                { label: "Latest Ads", href: "/buyer" },
                { label: PRODUCT.title, href: `/buyer/product/${id}` },
            ]}
            title={PRODUCT.title}
            images={PRODUCT_IMAGES}
            postedAt="Posted recently"
            location={PRODUCT.location}
            price={PRODUCT.price}
            description="Well-maintained 2017 Toyota Camry SE Sedan available for sale. Contact the seller to learn more and arrange a viewing."
            overview={[
                { label: "Condition", value: "Used" },
                { label: "Make", value: "Toyota" },
                { label: "Model", value: "Camry SE" },
                { label: "Year", value: "2017" },
            ]}
            seller={{
                name: "Name",
                isOnline: true,
                location: PRODUCT.location,
                phone: "+233 24 000 0000",
                feedbackCount: 0,
            }}
            relatedAds={RELATED_ADS}
        />
    );
}