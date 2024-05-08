import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import courseService from "../services/course.service";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        setSearchResult(data.data);
        console.log(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then(() => {
        window.alert("註冊課程成功!!，即將為你導向課程頁面");
        navigate("/course");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>必須先登入才可註冊課程</p>
          <button className="btn btn-primary btn-lg" onClick={handleLogin}>
            登入頁面
          </button>
        </div>
      )}

      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>只有學生帳號才可以註冊課程</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            onChange={handleSearchInput}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            搜尋課程
          </button>
        </div>
      )}

      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          <p>從API返回的數據</p>
          {searchResult.map((course) => {
            return (
              <div key={course._id} className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱{course.title}</h5>
                  <p className="card-text" style={{ margin: "0.5rem 0rem" }}>
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數：{course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格：{course.price}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師：{course.instructor.username}
                  </p>

                  <a
                    href="#"
                    id={course._id}
                    className="card-text btn btn-primary"
                    onClick={handleEnroll}
                  >
                    註冊課程
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CourseService from "../services/course.service";

// const EnrollComponent = (props) => {
//   let { currentUser, setCurrentUser } = props;
//   const navigate = useNavigate();
//   let [searchInput, setSearchInput] = useState("");
//   let [searchResult, setSearchResult] = useState(null);
//   const handleTakeToLogin = () => {
//     navigate("/login");
//   };
//   const handleChangeInput = (e) => {
//     setSearchInput(e.target.value);
//   };
//   const handleSearch = () => {
//     CourseService.getCourseByName(searchInput)
//       .then((data) => {
//         console.log(data);
//         setSearchResult(data.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
//   const handleEnroll = (e) => {
//     CourseService.enroll(e.target.id)
//       .then(() => {
//         window.alert("課程註冊成功。重新導向到課程頁面。");
//         navigate("/course");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     <div style={{ padding: "3rem" }}>
//       {!currentUser && (
//         <div>
//           <p>You must login first before searching for courses.</p>
//           <button
//             className="btn btn-primary btn-lg"
//             onClick={handleTakeToLogin}
//           >
//             Take me to login page.
//           </button>
//         </div>
//       )}
//       {currentUser && currentUser.user.role == "instructor" && (
//         <div>
//           <h1>Only students can enroll in courses.</h1>
//         </div>
//       )}
//       {currentUser && currentUser.user.role == "student" && (
//         <div className="search input-group mb-3">
//           <input
//             onChange={handleChangeInput}
//             type="text"
//             className="form-control"
//           />
//           <button onClick={handleSearch} className="btn btn-primary">
//             Search
//           </button>
//         </div>
//       )}
//       {currentUser && searchResult && searchResult.length != 0 && (
//         <div>
//           <p>我們從 API 返回的數據。</p>
//           {searchResult.map((course) => (
//             <div key={course._id} className="card" style={{ width: "18rem" }}>
//               <div className="card-body">
//                 <h5 className="card-title">課程名稱：{course.title}</h5>
//                 <p className="card-text">{course.description}</p>
//                 <p>價格: {course.price}</p>
//                 <p>目前的學生人數: {course.students.length}</p>
//                 <a
//                   href="#"
//                   onClick={handleEnroll}
//                   className="card-text btn btn-primary"
//                   id={course._id}
//                 >
//                   註冊課程
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnrollComponent;
