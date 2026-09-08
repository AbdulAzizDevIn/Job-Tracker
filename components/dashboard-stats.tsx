import { Board } from "@/lib/models/models.types";

interface DashboardStatsProp {
  board: Board;
}
const DashboardStats = ({ board }: DashboardStatsProp) => {
  const jobs = board.columns.flatMap((column) => column.jobApplications || []);

  const stats = [
    {
      label: "Tracked",
      value: jobs.length,
    },
    {
      label: "Wishlist",
      value: jobs.filter((job) => job.status === "wish list").length,
    },
    {
      label: "Applied",
      value: jobs.filter((job) => job.status === "applied").length,
    },
    {
      label: "Interviewing",
      value: jobs.filter((job) => job.status === "interviewing").length,
    },
    {
      label: "Offer",
      value: jobs.filter((job) => job.status === "offer").length,
    },
    {
      label: "Rejected",
      value: jobs.filter((job) => job.status === "rejected").length,
    },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-3">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`flex items-baseline ${
            index !== 0 ? "sm:border-l sm:pl-6" : ""
          }`}
        >
          <span className="text-lg font-semibold text-foreground sm:text-xl">
            {stat.value}
          </span>

          <span className="ml-1.5 text-xs text-muted-foreground sm:text-sm">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
