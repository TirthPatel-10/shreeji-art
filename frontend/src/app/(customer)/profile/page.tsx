"use client";

import { useState, useEffect } from "react";
import { customerApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Customer } from "@/types";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({
    companyName: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi
      .getProfile()
      .then((res) => {
        const c = res.data as Customer | null;
        if (c) {
          setCustomer(c);
          setForm({
            companyName: c.companyName ?? "",
            gstNumber: c.gstNumber ?? "",
            address: c.address ?? "",
            city: c.city ?? "",
            state: c.state ?? "",
            pincode: c.pincode ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus("saving");
    setErrorMsg("");
    try {
      const res = await customerApi.updateProfile(form);
      if (res.success) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("error");
        setErrorMsg(res.message || "Failed to save profile.");
      }
    } catch {
      setSaveStatus("error");
      setErrorMsg("Connection error. Please try again.");
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-brand-navy mb-6">My Profile</h1>
        <div className="bg-white rounded-xl border border-gray-100 h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">My Profile</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm max-w-lg">
        {/* Read-only user info */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-1">Name</p>
          <p className="text-brand-navy">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm font-medium text-gray-700 mt-3 mb-1">Email</p>
          <p className="text-gray-400">{user?.email}</p>
          {user?.phone && (
            <>
              <p className="text-sm font-medium text-gray-700 mt-3 mb-1">Phone</p>
              <p className="text-brand-navy">{user.phone}</p>
            </>
          )}
        </div>

        {/* Editable business info */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Business Details</p>

          {saveStatus === "error" && (
            <div className="text-sm text-brand-red bg-red-50 border border-red-100 rounded-lg px-4 py-2">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={set("companyName")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <input
              type="text"
              value={form.gstNumber}
              onChange={set("gstNumber")}
              placeholder="22AAAAA0000A1Z5"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={set("address")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={set("city")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={form.state}
                onChange={set("state")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                value={form.pincode}
                onChange={set("pincode")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors text-sm disabled:opacity-60"
          >
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "saved"
              ? "Saved ✓"
              : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
