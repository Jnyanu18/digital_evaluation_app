import React, { useState } from "react";
import { Button, Paper } from "@mui/material";
import AnswerPaperForm from "./AnswerPaperForm";

const FileUploadAnswerPaper = () => {
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
        Upload
      </Button>
      <p className="text-white text-center text-sm p-2 font-sans">Upload a new answer paper</p>
      <AnswerPaperForm
        open={openForm}
        handleClose={handleCloseForm}
        
      />
      </Paper>
    
  );
};

export default FileUploadAnswerPaper;