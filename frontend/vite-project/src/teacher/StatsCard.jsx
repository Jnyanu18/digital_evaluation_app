import { Grid2, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
  

const StatsCard = ({ data }) => {
    const assignedPapers = data.length;
    const evaluatedPapers = data.filter((element) => element.status === 'Evaluated').length;
    const pendingPapers = data.filter((element) => element.status === 'Pending').length;

  const stats = [
    { title: 'Total Assigned Papers', value: assignedPapers, color: '#3b82f6' , link: '/teacher/assigned-papers'},
    { title: 'Evaluated papers', value: evaluatedPapers, color: '#10b981' , link: '/teacher/checked-papers'},
    { title: 'Pending Papers', value: pendingPapers, color: '#f97316' , link: '/teacher/pending-papers'},
    { title: 'Total Feedbacks', value: data.totalFeedbacks, color: '#ef4444', link: '/teacher/feedbacks'},
  ];

  return (
    <Grid2 container spacing={2} className="mb-6" >
      {stats.map((stat, index) => (
        <Grid2 item xs={12} md={4} key={index} size={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={stat.link} className="text-decoration-none">
            <Paper elevation={3} className="p-6 text-center" style={{ backgroundColor: stat.color }}>
              
              <Typography variant="h8" className="text-white">
                {stat.title}
              </Typography>
              <Typography variant="h5" className="mt-2 text-white">
                {stat.value}
              </Typography>
            </Paper>
            </Link>
          </motion.div>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default StatsCard;