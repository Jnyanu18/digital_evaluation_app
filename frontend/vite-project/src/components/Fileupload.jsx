import React, { useState } from "react";
import { Button, Paper } from "@mui/material";
import QuestionPaperForm from "./QuestionPaperForm";

const Fileupload = ({ fetchQuestionPapers }) => {
  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <Paper elevation={10} style={{backgroundColor: "rgb(50,50,50)", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", flexDirection: "column"}}>

      <Button variant="contained" color="primary" onClick={handleOpenForm}>
        Create
      </Button>
      <p className="text-white text-center text-sm p-2 font-sans">Create a new question paper</p>
      <QuestionPaperForm
        open={openForm}
        handleClose={handleCloseForm}
        fetchQuestionPapers={() => {}}
      />
    </Paper>
  );
};

export default Fileupload;