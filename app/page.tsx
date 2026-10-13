import { redirect } from "next/navigation";
import React from "react";
const Home = () => {
  redirect("/registration");
};

export default React.memo(Home);
