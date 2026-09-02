"use server";

import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";

interface JobApplicationData {
  company: string;
  position: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
  columnId: string;
  boardId: string;
}

export async function createJobApplication(data: JobApplicationData) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  if (!data.company || !data.position || !data.columnId || !data.boardId) {
    return { error: "Missing required fields" };
  }

  // verify board ownership

  const board = await Board.findOne({
    _id: data.boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Board not found" };
  }

  // Verify column belong to board

  const column = await Column.findOne({
    _id: data.columnId,
    boardId: data.boardId,
  });

  if (!column) {
    return { error: "column not found" };
  }

  const maxOrder = (await JobApplication.findOne({ columnId: data.columnId })
    .sort({ order: -1 })
    .select("order")
    .lean()) as { order: number } | null;

    console.log(maxOrder);
    
  const jobApplication = await JobApplication.create({
    company: data.company,
    position: data.position,
    location: data.location,
    notes: data.notes,
    salary: data.salary,
    jobUrl: data.jobUrl,
    tags: data.tags || [],
    description: data.description,
    columnId: data.columnId,
    boardId: data.boardId,
    userId: session?.user.id,
    status: "applied",
    order: maxOrder ? maxOrder.order + 1 : 0 ,
  });


  await Column.findByIdAndUpdate(data.columnId,{
    $push: {jobApplications:jobApplication._id}
  })
  
  return {data: JSON.parse(JSON.stringify(jobApplication))};
}

