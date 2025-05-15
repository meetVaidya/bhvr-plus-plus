import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "shared";
import beaver from "../assets/beaver.svg";
import "../App.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

// Function to fetch data from API
const fetchHelloData = async (): Promise<ApiResponse> => {
  const response = await fetch(`${SERVER_URL}/hello`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["helloData"],
    queryFn: fetchHelloData,
    enabled: false, // Don't fetch automatically on component mount
  });

  return (
    <div className="p-2">
      <div>
        <a href="https://github.com/stevedylandev/bhvr" target="_blank">
          <img src={beaver} className="logo" alt="beaver logo" />
        </a>
      </div>
      <h1>bhvr</h1>
      <h2>Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="card">
        <div className="button-container">
          <button onClick={() => refetch()}>Call API</button>
          <a className="docs-link" target="_blank" href="https://bhvr.dev">
            Docs
          </a>
        </div>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}
        {data && (
          <pre className="response">
            <code>
              Message: {data.message} <br />
              Success: {data.success.toString()}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
