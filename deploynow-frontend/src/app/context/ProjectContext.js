"use client";
import { createContext, useContext, useCallback } from "react";
import axios from "axios";

const ProjectContext = createContext({
  getProjects: async () => [],
  deployProject: async () => {},
  getRepos: async () => [],
  getProjectDetails: async () => [],
});

export function ProjectProvider({ children }) {
  // getProjects: fetches all projects for the user
  const getProjects = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(res.data.projects);
      return res.data.projects || [];
    } catch (err) {
      console.error("Failed to fetch projects", err);
      return [];
    }
  }, []);

  // deployProject: deploys a new project
  const deployProject = useCallback(
    async ({ repo_url, framework, envVars }) => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/createproject`,
          { repo_url, framework, envVars },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return true;
      } catch (err) {
        console.error("Deployment failed", err);
        throw err;
      }
    },
    []
  );

  // getRepos: fetches GitHub repos for the user
  const getRepos = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/repos`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return res.data.repos || [];
    } catch (err) {
      console.error("GitHub Repo Fetch Failed", err);
      return [];
    }
  }, []);

  // getProjectDetails: fetches details of a specific project
  const getProjectDetails = useCallback(async (id) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("Project Details:", res.data);
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch logs", err);
      return [{ timestamp: "", message: "❌ Failed to fetch logs." }];
    }
  }, []);

  const redeployProject = useCallback(async (projectId, envVars) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/redeploy/${projectId}`,
        { envVars },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data.message || {};
    } catch (err) {
      console.error("Failed to redeploy project", err);
      throw err;
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        getProjects,
        deployProject,
        getRepos,
        getProjectDetails,
        redeployProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
