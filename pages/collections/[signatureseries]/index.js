import { useRouter } from "next/router";

export default function SignatureSeries() {
  const router = useRouter();
  const { signatureseries } = router.query;

  // Fetch data related to the specified signature series
  // You can display a list of items or default content here

  return (
    <div>
      <h1>Signature Series Page</h1>
      <p>Signature Series: {signatureseries}</p>
      {/* Display a list of items or default content here */}
    </div>
  );
}
