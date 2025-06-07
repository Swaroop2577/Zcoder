import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import TagFilter from '../../components/TagFilter/TagFilter';
import Pagination from '../../components/Pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import './Submissions.css'

const Submissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const questionsPerPage = 40;
  const [alertShown, setAlertShown] = useState(false);
  const { userLogin, isAuthenticated } = useAuthContext();

  // Improved useEffect for authentication and fetching
  useEffect(() => {
    // Debug logs for development
    // console.log("userLogin:", userLogin);
    // console.log("isAuthenticated:", isAuthenticated);
    // console.log("alertShown:", alertShown);

    // If not authenticated, show alert and redirect
    if (!isAuthenticated) {
      if (!alertShown) {
        alert('You need to be logged in to view this page.');
        setAlertShown(true);
        navigate('/login');
      }
      setLoading(false); // Prevent infinite loading if not authenticated
      return;
    }

    // Only fetch if userLogin is available and alert has been shown
    if (userLogin && isAuthenticated && alertShown) {
      fetchSubmissions(userLogin.result._id);
    }
    // eslint-disable-next-line
  }, [userLogin, isAuthenticated, alertShown, navigate]);

  // Fetch submissions for the authenticated user
  const fetchSubmissions = async (userId) => {
    setLoading(true); // Set loading true before fetch
    try {
      const response = await fetch(`/user/solutions/byUser/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
        setError(null);
      } else {
        setError('Failed to fetch questions');
      }
    } catch (error) {
      setError('Error fetching questions');
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  // Filter by selected tags
  const filteredQuestions = submissions.filter(question =>
    selectedTags.length === 0 ||
    question.topicTags.some(tag => selectedTags.includes(tag.name))
  );

  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Unique tags for filtering
  const allTags = [...new Set(submissions.flatMap(question => question.topicTags.map(tag => tag.name)))];

  // Tag selection handler
  const handleTagChange = (tag) => {
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter(t => t !== tag)
        : [...prevSelectedTags, tag]
    );
    setCurrentPage(1);
  };

  // Loading and error states
  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  if (error) {
    return <div className='error'>{error}</div>;
  }

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // Main render
  return (
    <>
      <div className="questions-list">
        <TagFilter tags={allTags} selectedTags={selectedTags} onTagChange={handleTagChange} />

        {currentQuestions.map((question) => (
          <div key={question._id} className="question-item">
            <Link to={`/submissions/${question.titleSlug}`}>
              {question.title}
              <p className='time'>
                Submitted at: {isNaN(new Date(question.createdAt)) ? 'Invalid Date' : new Date(question.createdAt).toLocaleString()}
              </p>
            </Link>
            <div className="tags">
              {question.topicTags.map((tag, tagIndex) => (
                <span key={tagIndex} className="tag">{tag.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
    </>
  );
};

export default Submissions;
