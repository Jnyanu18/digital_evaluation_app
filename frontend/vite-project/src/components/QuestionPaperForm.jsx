import React, { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from "@mui/material";
import axios from "axios";

const QuestionPaperForm = ({ open, handleClose, fetchQuestionPapers }) => {
  const [formData, setFormData] = useState({
    subject: "",
    exam: "",
    total_marks: "",
    questions: [],
  });

  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchSubjectsAndExams = async () => {
      try {
        const subjectsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/subject/all`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSubjects(subjectsResponse.data);

        const examsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/exam/all`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setExams(examsResponse.data);
      } catch (error) {
        console.error("Error fetching subjects or exams", error);
      }
    };

    fetchSubjectsAndExams();
  }, []);

  const handleInputChange = (e, value, field) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/questionPaper/create`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchQuestionPapers();
      handleClose();
    } catch (error) {
      console.error("Error creating question paper", error);
    }
  };

  const darkThemeStyles = {
    dialog: {
      backgroundColor: "rgb(50,50,50)",
    },
    textField: {
      backgroundColor: "rgb(60,60,60)",
      color: "white",
      "& .MuiInputBase-input": {
        color: "white",
      },
      "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.7)",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "rgba(255,255,255,0.3)",
        },
        "&:hover fieldset": {
          borderColor: "rgba(255,255,255,0.5)",
        },
      },
    },
    button: {
      color: "white",
      backgroundColor: "rgb(40,40,40)",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.1)",
      },
    },
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ style: darkThemeStyles.dialog }}>
      <DialogTitle style={{ color: "white" }}>Create New Question Paper</DialogTitle>
      <DialogContent>
        <Autocomplete 
          options={subjects}
          getOptionLabel={(subject) => subject.subjectName || ""}
          value={formData.subject}
          onChange={(e, value) => handleInputChange(e, value, "subject")}
          renderInput={(params) => (
            <TextField
              {...params}
              name="subject"
              label="Subject"
              fullWidth
              margin="normal"
              sx={darkThemeStyles.textField}
            />
          )}
        />

        <Autocomplete
          options={exams}
          getOptionLabel={(exam) => exam.name || ""}
          value={formData.exam}
          onChange={(e, value) => handleInputChange(e, value, "exam")}
          renderInput={(params) => (
            <TextField
              {...params}
              name="exam"
              label="Exam"
              fullWidth
              margin="normal"
              sx={darkThemeStyles.textField}
            />
          )}
        />

        <TextField
          name="total_marks"
          label="Total Marks"
          fullWidth
          margin="normal"
          value={formData.total_marks}
          onChange={(e) => handleInputChange(e, e.target.value, "total_marks")}
          sx={darkThemeStyles.textField}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={darkThemeStyles.button} >Cancel</Button>
        <Button onClick={handleSubmit} sx={darkThemeStyles.button}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionPaperForm;