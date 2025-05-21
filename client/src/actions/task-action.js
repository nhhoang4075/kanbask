async function createTask(taskData) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(taskData)
      });
  
      if (res.ok) {
        const json = await res.json();
  
        if (!json.success) {
          throw new Error(json.message);
        }
  
        return json.data.task;
      } else {
        throw new Error("createTask API Error");
      }
    } catch (err) {
      throw err;
    }
  }
  
  async function getProjectTasks(projectId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks?project_id=${projectId}`, {
        method: "GET",
        credentials: "include"
      });
  
      if (res.ok) {
        const json = await res.json();
  
        if (!json.success) {
          throw new Error(json.message);
        }
  
        return json.data.tasks;
      } else {
        throw new Error("getProjectTasks API Error");
      }
    } catch (err) {
      throw err;
    }
  }
  
  async function updateTask(taskId, taskData) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(taskData)
      });
  
      if (res.ok) {
        const json = await res.json();
  
        if (!json.success) {
          throw new Error(json.message);
        }
  
        return json.message;
      } else {
        throw new Error("updateTask API Error");
      }
    } catch (err) {
      throw err;
    }
  }
  
  async function deleteTask(taskId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include"
      });
  
      if (res.ok) {
        const json = await res.json();
  
        if (!json.success) {
          throw new Error(json.message);
        }
  
        return json.message;
      } else {
        throw new Error("deleteTask API Error");
      }
    } catch (err) {
      throw err;
    }
  }
  
  async function uploadTaskAttachments(taskId, files) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/attachments`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
  
      if (res.ok) {
        const json = await res.json();
  
        if (!json.success) {
          throw new Error(json.message);
        }
  
        return json.message;
      } else {
        throw new Error("uploadTaskAttachments API Error");
      }
    } catch (err) {
      throw err;
    }
  }
  
  async function getTaskAttachmentUrl(taskId, attachmentId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/attachments?attachment_id=${attachmentId}`, {
        method: "GET",
        credentials: "include"
      });
  
      if (res.ok) {
        const json = await res.json();
  
        if (!json.success) {
          throw new Error(json.message);
        }
  
        return json.message.url;
      } else {
        throw new Error("getTaskAttachmentUrl API Error");
      }
    } catch (err) {
      throw err;
    }
  }
  
  async function deleteTaskAttachments(taskId, attachmentIds) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/attachments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ attachment_ids: attachmentIds })
      });
  
      if (res.ok) {
        const json = await res.json();
  
        if (!json.success) {
          throw new Error(json.message);
        }
  
        return json.message;
      } else {
        throw new Error("deleteTaskAttachments API Error");
      }
    } catch (err) {
      throw err;
    }
  }
  
  export { 
    createTask, 
    getProjectTasks, 
    updateTask, 
    deleteTask,
    uploadTaskAttachments,
    getTaskAttachmentUrl,
    deleteTaskAttachments
  };