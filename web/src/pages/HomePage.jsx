import { useState } from "react";
import { PostList } from "../components/PostList";
import { CreatePostBox } from "../components/CreatePostBox";

const HomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="space-y-4">
      <CreatePostBox onCreated={() => setRefreshKey((k) => k + 1)} />
      <PostList refreshKey={refreshKey} />
    </div>
  );
};
export default HomePage;
