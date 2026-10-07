import ProductPage from "@/components/shared/ProductPage";

export default function CommonProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return <ProductPage params={params} basePath="/common-product" />;
}
