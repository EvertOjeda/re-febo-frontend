import React                                   from 'react';
import FirstPageIcon                           from '@material-ui/icons/FirstPage';
import LastPageIcon                            from '@material-ui/icons/LastPage';
import KeyboardArrowLeft                       from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight                      from '@material-ui/icons/KeyboardArrowRight';
import { IconButton }                          from '@material-ui/core';
import useMediaQuery                           from '@material-ui/core/useMediaQuery';
import {      makeStyles,
            createStyles,
             createTheme,
           ThemeProvider
       }                                      from '@material-ui/core/styles';
import { esES } from '@material-ui/core/locale';


const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
        "& .MuiIconButton-root>.MuiIconButton-label":{
          color: 'rgb(198 202 191)',
        },
        "& .MuiIconButton-root.Mui-disabled>.MuiIconButton-label":{
          color: '#7d8793',
      },
      flexShrink: 0,
      marginLeft: theme.spacing(2.1),
      padding: '0px'
    },

    button:{
      padding: '4px',
    },
  
  }),
);

export const TablePaginationActions =(props) => {

  const prefersDarkMode  =  useMediaQuery(`(prefers-color-scheme:`);
  const theme = createTheme({
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
    },
  }, esES);

  const { count, page, rowsPerPage, onPageChange } = props;
  const classes = useStyles();
  
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };
  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };
  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };
  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div id="paginacion" className={classes.root}>
      <ThemeProvider theme={theme}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton 
          onClick={handleBackButtonClick} 
          disabled={page === 0} 
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>

        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </ThemeProvider>
    </div>
  );

}

// import React                                   from 'react';
// import FirstPageIcon                           from '@material-ui/icons/FirstPage';
// import LastPageIcon                            from '@material-ui/icons/LastPage';
// import KeyboardArrowLeft                       from '@material-ui/icons/KeyboardArrowLeft';
// import KeyboardArrowRight                      from '@material-ui/icons/KeyboardArrowRight';
// import { IconButton }                          from '@material-ui/core';
// import useMediaQuery                           from '@material-ui/core/useMediaQuery';
// import {      makeStyles,
//             createStyles,
//           createMuiTheme,
//        }                                      from '@material-ui/core/styles';


// const useStyles = makeStyles((theme) =>
//   createStyles({
//     root: {
//         "& .MuiIconButton-root>.MuiIconButton-label":{
//           color: 'rgb(198 202 191)',
//         },
//         "& .MuiIconButton-root.Mui-disabled>.MuiIconButton-label":{
//           color: '#7d8793',
//       },
//       flexShrink: 0,
//       marginLeft: theme.spacing(2.1),
//       padding: '0px'
//     },

//     button:{
//       padding: '4px',
//     },
  
//   }),
// );

// export const TablePaginationActions =(props) => {

//   const prefersDarkMode  =  useMediaQuery(`(prefers-color-scheme:`);

//   const theme = React.useMemo(
//     () =>
//       createMuiTheme({
//         palette: {
//           type: prefersDarkMode ? 'dark' : 'light',
//         },
//       }),
//       [prefersDarkMode],
//     );
  
//   const classes = useStyles();
//   const { count, page, rowsPerPage, onChangePage } = props;
//   const handleFirstPageButtonClick = (event) => {
//     onChangePage(event, 0);
//   };
//   const handleBackButtonClick = (event) => {
//     onChangePage(event, page - 1);
//   };
//   const handleNextButtonClick = (event) => {
//     onChangePage(event, page + 1);
//   };
//   const handleLastPageButtonClick = (event) => {
//     onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
//   };

//   return (
//     <div id="paginacion" className={classes.root}>
//       <IconButton
//         onClick={handleFirstPageButtonClick}
//         disabled={page === 0}
//         aria-label="first page"
//       >
//         {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
//       </IconButton>
//       <IconButton 
//         onClick={handleBackButtonClick} 
//         disabled={page === 0} 
//         aria-label="previous page"
//       >
//         {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
//       </IconButton>

//       <IconButton
//         onClick={handleNextButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="next page"
//       >
//         {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
//       </IconButton>
//       <IconButton
//         onClick={handleLastPageButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="last page"
//       >
//         {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
//       </IconButton>
//     </div>
//   );

// }
