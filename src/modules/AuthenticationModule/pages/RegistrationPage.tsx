import styled from "@emotion/styled";
import RegistrationForm from "../components/Registration/RegistrationForm";

const RegistrationPage = () => {
	return (
		<PageContainer>
			<RegistrationForm />
		</PageContainer>
	);
};

export default RegistrationPage;

const PageContainer = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
	background-color: white;
	padding: 100px 0;
	box-sizing: border-box;
`;
