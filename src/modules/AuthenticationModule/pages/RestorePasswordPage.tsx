import styled from "@emotion/styled";
import RestorePasswordForm from "../components/Login/RestorePasswordForm";

const RestorePasswordPage = () => {
	return (
		<PageContainer>
			<RestorePasswordForm />
		</PageContainer>
	);
};

export default RestorePasswordPage;

const PageContainer = styled.div`
	display: flex;
	width: 100%;
	height: 100vh;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	background-color: white;
`;
