import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const [courseData, setCourseData] = useState(null);
  const [reUpdate, setReUpdate] = useState(false);
  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role == "instructor") {
        CourseService.get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role == "student") {
        CourseService.getEnrolledCourses(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [reUpdate]);
  const handleDelete = (e) => {
    CourseService.courseDelete(e.target.id)
      .then(() => {
        window.alert("刪除課程成功!!，即將為你導向課程頁面");
        setReUpdate(!reUpdate);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>必須先登入才可看此網頁內容</p>
          <button className="btn btn-primary btn-lg" onClick={handleLogin}>
            登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>歡迎來到Instructor頁面</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>歡迎來到Student頁面</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
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

                  {currentUser.user.role == "instructor" && (
                    <a id={course._id} href="#" onClick={handleDelete}>
                      刪除課程
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
