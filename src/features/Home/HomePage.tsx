import {useApiQuery} from "../../api/useApiQuery.ts";

interface HelloResponse {
    status: string;
    message: string;
}

const useHelloQuery = () =>
    useApiQuery<HelloResponse>(["hello"], {
        url: "/hello",
        method: "GET",
    }
);


export default function HomePage(){

    const { data, isLoading, error } = useHelloQuery();
    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al conectar con el backend</p>;

    return (
        <div className="p-4 bg-amber-500">
            <h1 className="text-xl font-bold">Test API</h1>
            <p>Status: {data?.status}</p>
            <p>Message: {data?.message}</p>
        </div>
    );
};
