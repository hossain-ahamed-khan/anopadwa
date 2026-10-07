import ProductPage from "@/components/shared/ProductPage";

export default function SellerProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return <ProductPage params={params} basePath="/seller/product" />;
}
