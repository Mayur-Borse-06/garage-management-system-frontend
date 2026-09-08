import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Button } from "../../../components/ui/Button";
import { useMechanicData } from "../hooks";

export default function MechanicDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: mechanic, isLoading, isError } = useMechanicData(id);

  return (
    <PageContainer
      title="Mechanic Details"
      description="Review mechanic information"
      actions={
        <Link to="/mechanics">
          <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Mechanics
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading mechanic...
        </div>
      ) : null}
      {isError || !mechanic ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">
          Unable to load this mechanic.
        </div>
      ) : null}
      {mechanic ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_0_rgba(15,23,42,0.02)]">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Name
              </div>
              <div className="mt-1 text-sm font-medium text-slate-800">
                {mechanic.name}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </div>
              <div className="mt-1 text-sm font-medium text-emerald-700">
                {mechanic.isActive ? "Active" : "Inactive"}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Phone
              </div>
              <div className="mt-1 text-sm text-slate-700">
                {mechanic.phone}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Specialization
              </div>
              <div className="mt-1 text-sm text-slate-700">
                {mechanic.specialization || "-"}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
