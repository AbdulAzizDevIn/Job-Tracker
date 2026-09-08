"use client";

import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import {
  Edit2,
  ExternalLink,
  MoreVertical,
  Trash2,
  MapPin,
  IndianRupee,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/actions/job-applications";
import React, { useState } from "react";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
}

export default function JobApplicationCard({
  job,
  columns,
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    status: job.status || "",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
    columnId: job.columnId || "",
  });

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });
      if (!result.error) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to Update job application", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (isLoading) return;
    try {
      setIsLoading(true);

      await deleteJobApplication(job._id);
    } catch (error) {
      console.error("Failed to delete job application", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMove(newColumnId: string) {
    if (isLoading) return;
    try {
      setIsLoading(true);

      await updateJobApplication(job._id, {
        columnId: newColumnId,
      });
    } catch (error) {
      console.error("Failed to move job application", error);
    } finally {
      setIsLoading(false);
    }
  }

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  return (
    <>
      <Card
        onClick={() => setIsDetailsOpen(true)}
        className="cursor-pointer transition-shadow hover:shadow-lg bg-white group shadow-sm"
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
              <p className="text-muted-foreground mb-2">{job.company}</p>
              <div className="flex items-center justify-between">
                {job.location && (
                  <div className=" flex items-center gap-1 text-xs mb-2 ">
                    <MapPin className="h-4 w-4" /> <span>{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className=" flex items-center mb-2 font-medium text-xs text-muted-foreground">
                    <IndianRupee className="h-3.5 w-3.5" />
                    <span>
                      {job.salary} {""}LPA
                    </span>
                  </div>
                )}
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1 mt-1">
                  {job.tags.slice(0, 3).map((tag, key) => (
                    <span
                      key={key}
                      className="shrink-0 max-w-22.5 truncate px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:text-blue-300 "
                    >
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 3 && (
                    <span className="shrink-0 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 ">
                      +{job.tags?.length - 3}
                    </span>
                  )}
                </div>
              )}

              {job.jobUrl && (
                <a
                  target="_blank"
                  href={job.jobUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4 " />
                </a>
              )}
            </div>
            <div className="flex items-start gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setIsEditing(true);
                    }}
                    disabled={isLoading}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {columns.length > 1 && (
                    <>
                      {columns
                        .filter((c) => c._id !== job.columnId)
                        .map((column, key) => (
                          <DropdownMenuItem
                            key={key}
                            disabled={isLoading}
                            onClick={() => handleMove(column._id)}
                          >
                            Move to {column.name}
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={isLoading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/*this part for popup delete button*/}

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>NO</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
                setIsDetailsOpen(false);
              }}
              disabled={isLoading}
              className="bg-destructive"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "YES"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* this is for edit job */}

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Job Application</DialogTitle>
            <DialogDescription>Track a new job application</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (LPA) </Label>
                  <Input
                    id="salary"
                    placeholder="e.g., ₹20000"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job URL </Label>
                <Input
                  id="jobUrl"
                  placeholder="https;//....."
                  value={formData.jobUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, jobUrl: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated) </Label>
                <Input
                  id="tags"
                  placeholder="React, Next.JS, High Pay"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief description of the role.."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* this is for view job */}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-none! sm:w-[90vw] sm:max-w-3xl! max-h-[85vh] overflow-y-auto">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold">
              {job.position}
            </DialogTitle>

            <DialogDescription className="text-base">
              {job.company}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="rounded-lg border bg-muted/30 p-4">
              <h3 className="mb-4 text-sm font-semibold">Job Information</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className="mt-1 inline-flex rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-700">
                    {job.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="mt-1 text-sm font-medium">
                    {job.location || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <p className="mt-1 text-sm font-medium">
                    {job.salary ? `${job.salary} LPA` : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Applied Date</p>
                  <p className="mt-1 text-sm font-medium">
                    {new Date(job.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Skills</h3>

              {job.tags && job.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, key) => (
                    <span
                      key={key}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills added</p>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Description</h3>

              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {job.description || "No description added"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Notes</h3>

              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {job.notes || "No notes added"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {job.jobUrl && (
                <div>
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Job Posting
                  </a>
                </div>
              )}

              <div className=" flex gap-2">
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  disabled={isLoading}
                  variant="destructive"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
