// 'use client'; // Asegura que este componente se renderice en el cliente

// import React, { useState } from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Box,
//   Badge,
// } from '@mui/material';
// import { useRouter } from 'next/navigation'; // Cambiado a 'next/navigation'
// import { format } from 'date-fns';
// import CommentIcon from '@mui/icons-material/Comment'; // Importa el icono de comentarios

// // Función para truncar el título
// const truncateTitle = (title, maxLength) => {
//   if (title.length <= maxLength) {
//     return title;
//   }
//   return title.substring(0, maxLength) + '...';
// };

// export default function PostList({ posts }) {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handlePostClick = (postId) => {
//     setLoading(true); // Activar el spinner

//     // Navegar a la página del post
//     router.push(`/posts/${postId}`);

//     // Desactivar el spinner después de un corto retraso (para esperar la navegación)
//     setLoading(false);
//   };

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         gap={2}
//         mt={4}
//       >
//         <CircularProgress />
//         <Typography variant="body1" style={{ color: '#555' }}>
//           Accediendo al post...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Grid container spacing={3}>
//       {posts.map((post) => (
//         <Grid item xs={12} sm={6} md={4} key={post.id}>
//           <Card
//             sx={{
//               backgroundColor: '#fff',
//               border: '1px solid #ddd',
//               borderRadius: '8px',
//               boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//               cursor: 'pointer',
//               height: 150, // Altura fija ajustada a 150px
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-between',
//               overflow: 'hidden',
//               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//               '&:hover': {
//                 transform: 'translateY(-5px)', // Movimiento hacia arriba
//                 boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)', // Sombra más pronunciada
//                 backgroundColor: '#f0f0f0', // Color de fondo al hacer hover
//               },
//             }}
//             onClick={() => handlePostClick(post.id)}
//           >
//             <CardContent>
//               <Typography
//                 variant="h6"
//                 component="h3"
//                 gutterBottom
//                 style={{ color: '#333' }}
//               >
//                 {truncateTitle(post.title, 30)}
//               </Typography>
//               <Typography variant="body2" style={{ color: '#555' }}>
//                 <strong>Autor:</strong> {post.author}
//               </Typography>
//               <Typography variant="body2" style={{ color: '#777' }}>
//                 <strong>Fecha:</strong>{' '}
//                 {post.date
//                   ? format(new Date(post.date), 'dd/MM/yyyy HH:mm:ss')
//                   : 'Fecha no disponible'}
//               </Typography>
//             </CardContent>
//             <Box
//               sx={{
//                 backgroundColor: 'rgba(0, 0, 0, 0.05)',
//                 padding: '5px 10px',
//                 borderRadius: '15px',
//                 margin: '10px',
//                 alignSelf: 'center',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <Badge
//                 badgeContent={post.comments ? post.comments.length : 0}
//                 showZero
//                 color="info"
//               >
//                 <CommentIcon sx={{ color: '#555' }} />{' '}
//                 {/* Icono de comentarios */}
//               </Badge>
//             </Box>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }
