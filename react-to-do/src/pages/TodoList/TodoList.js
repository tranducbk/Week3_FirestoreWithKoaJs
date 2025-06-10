import {
  ActionList,
  AppProvider,
  LegacyCard,
  ContextualSaveBar,
  FormLayout,
  Frame,
  Layout,
  Loading,
  Modal,
  Navigation,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  TextField,
  Toast,
  TopBar,
  ResourceList,
  Badge,
  Button,
  LegacyStack,
  Card,
  Text,
  Icon,
  InlineStack,
  BlockStack,
  Box,
} from '@shopify/polaris';
import {
  SidekickIcon,
  NotificationIcon,
  
  
} from '@shopify/polaris-icons';
import {useState, useCallback, useRef, useEffect} from 'react';
import todoService from '../../services/todoService';

function TodoList() {
  const defaultState = useRef({
    emailFieldValue: 'dharma@jadedpixel.com',
    nameFieldValue: 'Jaded Pixel',
  });

  const [toastActive, setToastActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [nameFieldValue, setNameFieldValue] = useState(
    defaultState.current.nameFieldValue,
  );
  const [emailFieldValue, setEmailFieldValue] = useState(
    defaultState.current.emailFieldValue,
  );
  const [storeName, setStoreName] = useState(
    defaultState.current.nameFieldValue,
  );
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [todos, setTodos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const handleDiscard = useCallback(() => {
    setEmailFieldValue(defaultState.current.emailFieldValue);
    setNameFieldValue(defaultState.current.nameFieldValue);
    setIsDirty(false);
  }, []);

  const handleSearchResultsDismiss = useCallback(() => {
    setSearchActive(false);
    setSearchValue('');
  }, []);
  const handleSearchFieldChange = useCallback((value) => {
    setSearchValue(value);
    setSearchActive(value.length > 0);
  }, []);

  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    [],
  );
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive,
      ),
    [],
  );

  const toggleModalActive = useCallback(
    () => setModalActive((modalActive) => !modalActive),
    [],
  );

  const toggleIsSecondaryMenuOpen = useCallback(
    () => setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen),
    [],
  );

  const toggleIsNotificationMenuOpen = useCallback(
    () => setIsNotificationMenuOpen((isNotificationMenuOpen) => !isNotificationMenuOpen),
    [],
  );

  const userMenuActions = [
    {
      items: [{content: 'Community forums'}],
    },
  ];
  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name="Stellar Interiors"
      detail={storeName}
      initials="S"
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[{content: 'Shopify help center'}, {content: 'Community forums'}]}
    />
  );

  const NotificationMenu = () => (
    <TopBar.Menu
      activatorContent={
        <span>
          <Icon source={NotificationIcon} />
          <Text as="span" visuallyHidden>
            Notifications
          </Text>
        </span>
      }
      open={isNotificationMenuOpen}
      onOpen={toggleIsNotificationMenuOpen}
      onClose={toggleIsNotificationMenuOpen}
      actions={[
        {
          items: [{content: 'New notification'}],
        },
      ]}
    />
  );

  const SidekickMenu = () => (
    <TopBar.Menu
      activatorContent={
        <span>
          <Icon source={SidekickIcon} />
          <Text as="span" visuallyHidden>
            Secondary menu
          </Text>
        </span>
      }
      open={isSecondaryMenuOpen}
      onOpen={toggleIsSecondaryMenuOpen}
      onClose={toggleIsSecondaryMenuOpen}
      actions={[
        {
          items: [{content: 'Community forums'}],
        },
      ]}
    />
  );

  const CustomSecondaryMenu = () => (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      <SidekickMenu />
      <NotificationMenu />
    </div>
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder="Search"
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      secondaryMenu={<CustomSecondaryMenu />}
      searchResultsVisible={searchActive}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const loadingMarkup = isLoading ? <Loading /> : null;

  const resourceName = {
    singular: 'todo',
    plural: 'todoes',
  };

  const getStatusBadge = (completed) => (
    completed ? <Badge tone="success">Complete</Badge> : <Badge tone="attention">Incomplete</Badge>
  );

  const renderItem = (item) => {
    const { id, title, completed } = item;
    return (
      <ResourceList.Item
        id={id}
      >
        <LegacyStack alignment="center">
          <LegacyStack.Item fill>
            <div style={{ fontWeight: 500 }}>{title}</div>
          </LegacyStack.Item>
          <LegacyStack.Item>
            {getStatusBadge(completed)}
          </LegacyStack.Item>
          <LegacyStack.Item>
            <Button size="slim" disabled={completed} primary onClick={() => handleComplete(id)}>Complete</Button>
          </LegacyStack.Item>
          <LegacyStack.Item>
            <Button tone="critical" size="slim" destructive onClick={() => handleDelete(id)}>Delete</Button>
          </LegacyStack.Item>
        </LegacyStack>
      </ResourceList.Item>
    );
  };

  const handleBulkComplete = useCallback(async () => {
      try {
          await Promise.all(selectedItems.map(id => {
              const todo = todos.find(t => t.id === id);
              return todoService.updateTodo(id, {...todo, completed: true});
          }));
          setTodos(prevTodos => prevTodos.map(todo => 
              selectedItems.includes(todo.id) ? {...todo, completed: true} : todo
          ));
          setSelectedItems([]);
      } catch (error) {
          console.error('Error completing todos:', error);
      }
  }, [selectedItems, todos]);

  const handleBulkIncomplete = useCallback(async () => {
      try {
          await Promise.all(selectedItems.map(id => {
              const todo = todos.find(t => t.id === id);
              return todoService.updateTodo(id, {...todo, completed: false});
          }));
          setTodos(prevTodos => prevTodos.map(todo => 
              selectedItems.includes(todo.id) ? {...todo, completed: false} : todo
          ));
          setSelectedItems([]);
      } catch (error) {
          console.error('Error marking todos as incomplete:', error);
      }
  }, [selectedItems, todos]);

  const handleBulkDelete = useCallback(async () => {
      try {
          // await Promise.all(selectedItems.map(id => todoService.deleteTodo(id)));
          setTodos(prevTodos => prevTodos.filter(todo => !selectedItems.includes(todo.id)));
          setSelectedItems([]);
      } catch (error) {
          console.error('Error deleting todos:', error);
      }
  }, [selectedItems]);

  const BulkActions = () => {
    if (selectedItems.length === 0) return null;

    return (
      <Box
        position="fixed"
        insetBlockEnd="400"
        insetInlineStart="0"
        insetInlineEnd="0"
        zIndex="100"
      >
        <BlockStack inlineAlign="center">
          <Card>
            <InlineStack gap="400" align="center">
              <Button onClick={handleBulkComplete}>Complete</Button>
              <Button onClick={handleBulkIncomplete}>Incomplete</Button>
              <Button destructive onClick={handleBulkDelete}>Delete</Button>
            </InlineStack>
          </Card>
        </BlockStack>
      </Box>
    );
  };

  const todoListMarkup = (
    <ResourceList
      resourceName={resourceName}
      items={todos}
      selectedItems={selectedItems}
      showHeader={selectedItems.length > 0}
      onSelectionChange={setSelectedItems}
      renderItem={renderItem}
      selectable
    />
  );
  
  const fetchTodos = useCallback(async () => {
      try {
          setIsLoading(true);
          const res = await todoService.getAllTodos();
          setTodos(res.data.data || []);
      } catch (error) {
          console.error('Error fetching todos:', error);
      } finally {
          setIsLoading(false);
      }
  }, []);

  useEffect(() => {
      fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = useCallback(async () => {
      try {
          if (!newTodo.trim()) return;
          const res = await todoService.addTodo(newTodo);
          setTodos(prevTodos => [...prevTodos, res.data.data]);
          setNewTodo("");
          setModalActive(false);
      } catch (error) {
          console.error('Error adding todo:', error);
      }
  }, [newTodo]);

  const actualPageMarkup = (
    <Page title={"Todoes"} primaryAction={{content: 'Create', onAction: toggleModalActive}}>
      {todoListMarkup}
    </Page>
  );

  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </TextContainer>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );

  const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

  const modalMarkup = (
    <Modal
      open={modalActive}
      onClose={() => { setModalActive(false); setNewTodo(""); }}
      title="Create todo"
      primaryAction={{
        content: 'Add',
        onAction: handleAddTodo,
        disabled: !newTodo.trim(),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: () => { setModalActive(false); setNewTodo(""); },
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Title"
            value={newTodo}
            onChange={setNewTodo}
            autoComplete="off"
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );

  const logo = {
    width: 86,
    topBarSource:
      'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
    contextualSaveBarSource:
      'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
    accessibilityLabel: 'Shopify',
  };

  const handleComplete = useCallback(async (id) => {
      try {
          const todo = todos.find(todo => todo.id === id);
          if (todo) {
              const updatedTodo = {...todo, completed: true};
              await todoService.updateTodo(id, updatedTodo);
              setTodos(prevTodos => prevTodos.map(todo => 
                  todo.id === id ? {...todo, completed: true} : todo
              ));
          }
      } catch (error) {
          console.error('Error completing todo:', error);
      }
  }, [todos]);

  const handleDelete = useCallback(async (id) => {
      try {
          // await todoService.deleteTodo(id);
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      } catch (error) {
          console.error('Error deleting todo:', error);
      }
  }, []);

  return (
    <div style={{ margin: '0 auto', position: 'relative', width: '100%' }}>
        <Frame
          logo={logo}
          topBar={topBarMarkup}
        >
          {loadingMarkup}
          {pageMarkup}
          {modalMarkup}
          <BulkActions />
        </Frame>
    </div>  
  );
}

export default TodoList;