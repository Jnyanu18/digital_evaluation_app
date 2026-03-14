import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Paper, 
  Typography, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  CircularProgress,
  Box
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ViewAnswerpaper = () => {
  const { answerSheetId } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [answerSheetUrl, setAnswerSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalMarks, setTotalMarks] = useState(0);

  const darkThemeStyles = {
    paper: {
      backgroundColor: "#1e1e1e",
      color: "white",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      accent: "#64b5f6",
    },
    tableHeader: {
      backgroundColor: "#2d2d2d",
      color: "#64b5f6",
      fontWeight: "bold"
    },
    tableRow: {
      "&:nth-of-type(odd)": {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      },
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      }
    },
    totalMarks: {
      color: "#4caf50",
      fontWeight: "bold"
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/answerpaper/${answerSheetId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        setAnswerSheetUrl(response.data.answerSheet);
        const initialMarks = response.data.marks || [];
        setMarks(initialMarks);
        calculateTotal(initialMarks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [answerSheetId]);

  const calculateTotal = (marksArray) => {
    const total = marksArray.reduce((acc, curr) => acc + (curr.marksObtained || 0), 0);
    setTotalMarks(total);
  };

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="#1e1e1e"
      >
        <CircularProgress style={{ color: darkThemeStyles.text.accent }} />
      </Box>
    );
  }

  return (
    <div className="bg-zinc-800 min-h-screen text-white p-8">
      <div className="flex items-center mb-8">
        <IconButton 
          onClick={() => navigate(-1)} 
          style={{ color: darkThemeStyles.text.accent }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography 
          variant="h4" 
          style={{ 
            color: darkThemeStyles.text.accent,
            marginLeft: "16px"
          }}
        >
          Answer Paper Evaluation
        </Typography>
      </div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={10} 
            style={darkThemeStyles.paper}
            className="p-6 h-full"
          >
            <Typography 
              variant="h5" 
              style={{ 
                color: darkThemeStyles.text.accent,
                marginBottom: "24px"
              }}
            >
              Student Answer Sheet
            </Typography>
            {answerSheetUrl ? (
              <iframe
                src={answerSheetUrl}
                width="100%"
                height="600px"
                style={{ 
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px"
                }}
                title="Student Answer Sheet"
              />
            ) : (
              <Typography 
                variant="body1" 
                style={{ color: darkThemeStyles.text.secondary }}
                className="text-center py-16"
              >
                No answer sheet available for viewing
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={10} 
            style={darkThemeStyles.paper}
            className="p-6 h-full"
          >
            <Typography 
              variant="h5" 
              style={{ 
                color: darkThemeStyles.text.accent,
                marginBottom: "24px"
              }}
            >
              Evaluation Details
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={darkThemeStyles.tableHeader}>Question</TableCell>
                    <TableCell style={darkThemeStyles.tableHeader} align="right">Max Marks</TableCell>
                    <TableCell style={darkThemeStyles.tableHeader} align="right">Marks Obtained</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marks.length > 0 ? (
                    marks.map((mark, index) => (
                      <TableRow key={index} style={darkThemeStyles.tableRow}>
                        <TableCell style={{ color: darkThemeStyles.text.primary ,
                          width: "60%",
                          height:"auto",
                        }}>
                          Q{mark.questionId.questionNumber }&#160;
                          { mark.questionId.questionText}
                        </TableCell>
                        <TableCell align="right" style={{ color: darkThemeStyles.text.primary }}>
                          {mark.questionId.maxMarks || "-"}
                        </TableCell>
                        <TableCell align="right" style={{ color: darkThemeStyles.text.primary }}>
                          {mark.marksObtained || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell 
                        colSpan={3} 
                        style={{ 
                          color: darkThemeStyles.text.secondary,
                          textAlign: "center",
                          padding: "24px"
                        }}
                      >
                        No marks data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box 
              display="flex" 
              justifyContent="flex-end" 
              mt={4}
              p={2}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "4px"
              }}
            >
              <Typography 
                variant="h6" 
                style={darkThemeStyles.totalMarks}
              >
                Total Marks: {totalMarks}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewAnswerpaper;