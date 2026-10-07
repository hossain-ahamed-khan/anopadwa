import ProductPage from "@/components/shared/ProductPage";

export default function BuyerProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return <ProductPage params={params} basePath="/buyer/product" />;
}
