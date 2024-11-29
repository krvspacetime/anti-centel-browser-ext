import { Button, Table } from "@mantine/core";
import { TargetAdderView } from "./TargetAdderView";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNotification } from "../../hooks/useNotification";
import { CustomNotiication } from "../../../notification/CustomNotification";

export interface TargetItem {
  handle: string;
  username: string;
  category: string;
  filter_style: string;
  description: string;
  remove?: string;
}

export function TargetRoot() {
  const [targetList, setTargetList] = useState<TargetItem[]>([]);
  const [targetItem, setTargetItem] = useState<TargetItem>({
    handle: "",
    username: "",
    category: "",
    filter_style: "",
    description: "",
  });
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const onAddToTargetList = async (target: TargetItem) => {
    try {
      const response = await fetch("http://localhost:8000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(target),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setAddSuccess(true);
      showForDuration(3000);
      const data = await response.json();
      console.log(data);
      setTargetList((prev) => [...prev, data]);
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setAddSuccess(false);
    }
  };

  const removeFromTargetList = async (handle: string) => {
    try {
      const response = await fetch(`http://localhost:8000/delete/${handle}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ handle }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setDeleteSuccess(true);
      showForDuration(3000);
      const data = await response.json();

      await handleRemove(handle);
      return data;
    } catch (e) {
      console.error(e);
      throw e; // Rethrow the error to be caught by `handleRemove`
    } finally {
      setDeleteSuccess(false);
    }
  };

  const onChangeTargetItem = (itemName: string, itemValue: unknown) => {
    setTargetItem((prev) => ({
      ...prev,
      [itemName]: itemValue,
    }));
  };

  const getAllTargetItems = async () => {
    try {
      const response = await fetch("http://localhost:8000/collect");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      setTargetList(data);
      return data;
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = async (handle: string) => {
    try {
      await removeFromTargetList(handle);
      setTargetList((prev) => prev.filter((item) => item.handle !== handle));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const rows = (
    <AnimatePresence>
      {targetList.map((element) => (
        <motion.tr
          key={element.handle}
          initial={{ x: 300, opacity: 0 }} // Start off-screen to the right
          animate={{ x: 0, opacity: 1 }} // Slide into position
          exit={{ x: 300, opacity: 0 }} // Slide out to the right on removal
          transition={{ duration: 0.3 }} // Adjust duration as needed
          className="hover:text-white"
        >
          <Table.Td>{element.handle}</Table.Td>
          <Table.Td>{element.username}</Table.Td>
          <Table.Td>{element.category}</Table.Td>
          <Table.Td>{element.filter_style}</Table.Td>
          <Table.Td>{element.description}</Table.Td>
          <Table.Td>
            <Button
              variant="hover"
              onClick={() => handleRemove(element.handle)}
            >
              X
            </Button>
          </Table.Td>
        </motion.tr>
      ))}
    </AnimatePresence>
  );

  const { isShown, showForDuration, notificationRef } = useNotification();

  useEffect(() => {
    getAllTargetItems();
  }, []);
  return (
    <>
      <section className="mt-12 flex w-full justify-center">
        <div
          className="overflow-y-auto"
          style={{
            width: "70%",
            // height: "60vh",
          }}
        >
          <TargetAdderView
            targetItem={targetItem}
            onAddToTargetList={onAddToTargetList}
            onChangeTargetItem={onChangeTargetItem}
          />
          <Table.ScrollContainer minWidth={"100%"}>
            <Table
              striped
              stickyHeader
              highlightOnHover={true}
              highlightOnHoverColor="rgb(0 0 0 / 0.2)"
              withColumnBorders={true}
              withRowBorders={true}
            >
              <Table.Thead
                className="overflow-x-hidden text-white"
                style={{
                  backgroundColor: "",
                }}
              >
                <Table.Tr>
                  <Table.Th>Handle</Table.Th>
                  <Table.Th>Username</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Filter Style</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Actions</Table.Th> {/* New column */}
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>{rows}</Table.Tbody>
              {/* <Table.Caption>Scroll page to see sticky thead</Table.Caption> */}
            </Table>
          </Table.ScrollContainer>
        </div>
      </section>
      <CustomNotiication
        show={isShown}
        ref={notificationRef}
        where={"topright"}
      >
        <div
          className="bg-emerald-300 text-white"
          style={{
            width: "200px",
            height: "60px",
          }}
        >
          {addSuccess && <p>Added Successfully</p>}
          {deleteSuccess && <p>Deleted Successfully</p>}
        </div>
      </CustomNotiication>
    </>
  );
}
