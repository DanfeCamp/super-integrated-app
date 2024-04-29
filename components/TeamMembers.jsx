"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
} from "@material-tailwind/react";

const TeamMembers = () => {
  return (
    <div>
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 my-4 sm:my-6">
        Our Team
      </h2>

      {/* Team Members */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Member: 1 */}
        <Card className="w-full bg-white mx-auto">
          <CardHeader floated={false} className="h-72">
            <img
              src="/img/team-member/1.jpg"
              alt="profile-picture"
              className="w-full h-full object-cover"
            />
          </CardHeader>
          <CardBody className="text-center py-2">
            <Typography variant="h4" color="blue-gray">
              Niraj Giri
            </Typography>
            <Typography color="blue-gray" className="font-medium" textGradient>
              Developer
            </Typography>
          </CardBody>
          <CardFooter className="flex justify-center gap-3 pt-0 pb-2 h-10">
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="https://github.com/nirajgirixd"
                variant="lead"
                color="grey"
                target="_blank"
              >
                <FontAwesomeIcon icon={faGithub} />
              </Typography>
            </Tooltip>
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="https://www.linkedin.com/in/nirajgirixd/"
                variant="lead"
                color="light-blue"
                target="_blank"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Typography>
            </Tooltip>
          </CardFooter>
        </Card>

        {/* Member: 2 */}
        <Card className="w-full bg-white mx-auto">
          <CardHeader floated={false} className="h-72">
            <img
              src="/img/team-member/1.jpg"
              alt="profile-picture"
              className="w-full h-full object-cover"
            />
          </CardHeader>
          <CardBody className="text-center py-2">
            <Typography variant="h4" color="blue-gray">
              Niraj Giri
            </Typography>
            <Typography color="blue-gray" className="font-medium" textGradient>
              Developer
            </Typography>
          </CardBody>
          <CardFooter className="flex justify-center gap-3 pt-0 pb-2 h-10">
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="https://github.com/nirajgirixd"
                variant="lead"
                color="grey"
                target="_blank"
              >
                <FontAwesomeIcon icon={faGithub} />
              </Typography>
            </Tooltip>
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="https://www.linkedin.com/in/nirajgirixd/"
                variant="lead"
                color="light-blue"
                target="_blank"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Typography>
            </Tooltip>
          </CardFooter>
        </Card>

        {/* Member: 3 */}
        <Card className="w-full bg-white mx-auto">
          <CardHeader floated={false} className="h-72">
            <img
              src="/img/team-member/1.jpg"
              alt="profile-picture"
              className="w-full h-full object-cover"
            />
          </CardHeader>
          <CardBody className="text-center py-2">
            <Typography variant="h4" color="blue-gray">
              Niraj Giri
            </Typography>
            <Typography color="blue-gray" className="font-medium" textGradient>
              Developer
            </Typography>
          </CardBody>
          <CardFooter className="flex justify-center gap-3 pt-0 pb-2 h-10">
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="https://github.com/nirajgirixd"
                variant="lead"
                color="grey"
                target="_blank"
              >
                <FontAwesomeIcon icon={faGithub} />
              </Typography>
            </Tooltip>
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="https://www.linkedin.com/in/nirajgirixd/"
                variant="lead"
                color="light-blue"
                target="_blank"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Typography>
            </Tooltip>
          </CardFooter>
        </Card>

        {/* Member: 4 */}
        <Card className="w-full bg-white mx-auto">
          <CardHeader floated={false} className="h-72">
            <img
              src="/img/team-member/1.jpg"
              alt="profile-picture"
              className="w-full h-full object-cover"
            />
          </CardHeader>
          <CardBody className="text-center py-2">
            <Typography variant="h4" color="blue-gray">
              Niraj Giri
            </Typography>
            <Typography color="blue-gray" className="font-medium" textGradient>
              Developer
            </Typography>
          </CardBody>
          <CardFooter className="flex justify-center gap-3 pt-0 pb-2 h-10">
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="https://github.com/nirajgirixd"
                variant="lead"
                color="grey"
                target="_blank"
              >
                <FontAwesomeIcon icon={faGithub} />
              </Typography>
            </Tooltip>
            <Tooltip content="Follow">
              <Typography
                as="a"
                href="https://www.linkedin.com/in/nirajgirixd/"
                variant="lead"
                color="light-blue"
                target="_blank"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Typography>
            </Tooltip>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TeamMembers;
