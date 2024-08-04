import { useState } from "react";
import AdminSideBar from "./AdminSideBar";

export default function AdministrationLayout({ children }) {
  return (
    <>
      <div>
        <AdminSideBar />
        <main className="py-10 lg:pl-72">
          <div className=" px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
