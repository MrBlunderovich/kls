import styles from "./Distributors.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  distributorsActions,
  fetchDistributors,
} from "../../redux/distributorsSlice";
import CustomButton from "../../components/UI/CustomButton/CustomButton";
import TableButton from "../../components/UI/TableButton/TableButton";
import editIcon from "../../assets/icons/mode_edit.svg";
import ADTable from "../../components/ADTable/ADTable";
import { PATHS } from "../../common/constants";
import renderIndex from "../../utils/renderIndex";
import usePermissions from "../../hooks/usePermissions";

export default function Distributors() {
  const { distributors, isLoading } = useSelector(
    (state) => state.distributors,
  );
  const { isDirector } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tableColumns = [
    {
      title: "№",
      dataIndex: "rowIndex",
      key: "rowIndex",
      align: "center",
      width: 55,
      render: renderIndex,
    },
    {
      title: "ФИО",
      dataIndex: "name",
      align: "left",
      render: (text, record) => (
        <Link
          className={styles.distributorLink}
          to={`${PATHS.distributorsProfile}/${record.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Регион",
      dataIndex: "region",
      key: "region",
      align: "left",
    },
  ];
  isDirector &&
    tableColumns.push({
      title: "Ред.",
      key: "action",
      align: "center",
      width: 78,
      render: (_, record) => (
        <Link
          to={`${PATHS.distributorsEdit}/${record.id}`}
          onClick={(event) => event.stopPropagation()}
        >
          <TableButton>
            <img src={editIcon} alt="edit icon" />
          </TableButton>
        </Link>
      ),
    });

  useEffect(() => {
    dispatch(fetchDistributors());
    return () => dispatch(distributorsActions.clearData());
  }, []);

  return (
    <div className={styles.Distributors}>
      <div className="container">
        <div className={styles.filterbar}>
          {isDirector && (
            <Link to={PATHS.distributorsCreate}>
              <CustomButton variant="primary">Создать</CustomButton>
            </Link>
          )}
        </div>

        <ADTable
          loading={isLoading}
          dataSource={distributors}
          rowKey="id"
          rowClassName={styles.tableRow}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(`${PATHS.distributorsProfile}/${record.id}`);
              },
            };
          }}
          columns={tableColumns}
          height="70vh"
        />
      </div>
    </div>
  );
}
