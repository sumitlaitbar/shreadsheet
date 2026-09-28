import { useContext, useEffect } from "react";
import { SpreadsheetContext } from "../Context/SpreadsheetContext";
import { useRouter } from "next/navigation";

function PermissionPopupLeavesite() {
  const { isBack } = useContext(SpreadsheetContext)!;
  const router = useRouter();
  useEffect(() => {
    const handleBackbtn = (e: PopStateEvent) => {
      if (!isBack) return;
      e.preventDefault();
      router.replace("/login");
      // window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handleBackbtn);
    return () => {
      window.removeEventListener("popstate", handleBackbtn);
    };
  }, [isBack]);

  return null;
}

export default PermissionPopupLeavesite;
