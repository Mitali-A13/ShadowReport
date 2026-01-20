"use client";

import { useState } from "react";
import { Search, Loader } from "lucide-react";

interface ReportDetails {
  id: string;
  reportId: string;
  status: string;
  createdAt: string;
  title: string;
  description: string;
  location: string;
}

export function ReportTracker() {
  const [reportId, setReportId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportDetails, setReportDetails] =
    useState<ReportDetails | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setReportDetails(null);
    setLoading(true);

    if (!reportId.trim()) {
      setError("Please enter a report ID");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/reports/${reportId}`);

      if (!response.ok) {
        throw new Error("Report not found");
      }

      const data = await response.json();

      // ✅ FIX: API returns { success, report }
      setReportDetails(data.report);
    } catch (err) {
      setError("Unable to find report. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-9 items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 text-sm text-sky-400">
          <Search className="w-4 h-4" />
          Track Your Report Status
        </div>

        <h1 className="mt-6 text-4xl font-bold text-white">
          Track Your Report
          <span className="block text-sky-400">Stay Informed</span>
        </h1>

        <p className="mt-4 text-zinc-400">
          Enter your report ID to check the current status and updates
        </p>
      </div>

      <div className="flex justify-center">
        <div
          className={`transition-all duration-300 ${
            reportDetails ? "w-full grid md:grid-cols-2 gap-8" : "max-w-lg w-full"
          }`}
        >
          {/* Form */}
          <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Report ID
                </label>
                <input
                  type="text"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/5 text-white"
                  placeholder="Enter your report ID"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-red-400 bg-red-500/10 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white py-3 rounded-xl flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader className="animate-spin w-5 h-5" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {loading ? "Searching..." : "Track Report"}
              </button>
            </form>
          </div>

          {/* Results */}
          {reportDetails && (
            <div className="bg-black/40 rounded-xl border border-white/5 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Report Details
              </h2>

              <div className="space-y-3">
                <InfoRow
                  label="Status"
                  value={reportDetails.status.replace("_", " ")}
                  color={getStatusColor(reportDetails.status)}
                />
                <InfoRow label="Report ID" value={reportDetails.reportId} />
                <InfoRow
                  label="Submitted On"
                  value={new Date(
                    reportDetails.createdAt
                  ).toLocaleDateString()}
                />
                <InfoRow label="Title" value={reportDetails.title} />
                <InfoRow label="Location" value={reportDetails.location} />
                <InfoRow label="Description" value={reportDetails.description} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function getStatusColor(status?: string): string {
  if (!status) return "text-white";

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    in_progress: "text-sky-400",
    resolved: "text-emerald-400",
    dismissed: "text-red-400",
  };

  return statusColors[status.toLowerCase()] || "text-white";
}

function InfoRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex justify-between bg-white/5 p-3 rounded-lg">
      <span className="text-zinc-400">{label}</span>
      <span className={`font-medium ${color ?? "text-white"}`}>
        {value || "-"}
      </span>
    </div>
  );
}
