'use client'

import { Button, Dialog, Flex, Table, Text, TextField } from "@radix-ui/themes"
import api from "./api/api"
import { useEffect, useState } from "react"
import { Pencil1Icon, MoonIcon, SunIcon, MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons"
import { CirclePlus, Github, Pencil, Search, Trash2, UserRound } from "lucide-react"

type Users = {
  fullname: string,
  email: string,
  age: number,
  country: string
  _id: string
}

const EditUserDialog = ({ usersOne, onClose, onUpdated }: { usersOne: Users | null, onClose: () => void, onUpdated: (user: Users) => void }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (usersOne) {
      setFullname(usersOne.fullname || "");
      setEmail(usersOne.email || "");
      setAge(typeof usersOne.age === 'number' ? usersOne.age.toString() : usersOne.age);
      setCountry(usersOne.country || "");
    }
  }, [usersOne]);

  const updateUser = async (id: string) => {
    try {
      const res = await api.put(`/users/${id}`, {
        fullname,
        email,
        age,
        country
      })
      console.log(res.data)
      onUpdated(res.data);
      onClose();
    } catch (error) {
      console.error("Erreur update user: ", error)
    }
  }

  return (
    <Dialog.Root open={!!usersOne} onOpenChange={onClose}>
      <Dialog.Content maxWidth="500px" className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl">
        <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
          Modifier l'utilisateur
        </Dialog.Title>
        {usersOne && (
          <form onSubmit={(e) => e.preventDefault()}>
            <Flex direction="column" gap="4" className="mt-4">
              <label>
                <Text as="div" size="2" mb="2" weight="bold" className="text-sm font-semibold text-slate-700 tracking-wide">
                  Nom complet
                </Text>
                <TextField.Root
                  placeholder="Entrez le nom complet"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="rounded-md border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/50 backdrop-blur-sm"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="2" weight="bold" className="text-sm font-semibold text-slate-700 tracking-wide">
                  Email
                </Text>
                <TextField.Root
                  placeholder="Entrez l'email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/50 backdrop-blur-sm"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="2" weight="bold" className="text-sm font-semibold text-slate-700 tracking-wide">
                  Âge
                </Text>
                <TextField.Root
                  placeholder="Entrez l'âge"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="rounded-md border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/50 backdrop-blur-sm"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="2" weight="bold" className="text-sm font-semibold text-slate-700 tracking-wide">
                  Pays
                </Text>
                <TextField.Root
                  placeholder="Entrez le pays"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="rounded-md border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/50 backdrop-blur-sm"
                />
              </label>
            </Flex>
          </form>
        )}

        <Flex gap="3" mt="6" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" className="rounded-md border-slate-200 hover:bg-slate-50">
              Annuler
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              disabled={!usersOne}
              onClick={() => usersOne && updateUser(usersOne._id)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none rounded-md shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Enregistrer
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

function App() {
  const [users, setUsers] = useState<Users[]>([])
  const [fullname, setFullname] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [age, setAge] = useState<number | string>("")
  const [country, setCountry] = useState<string>("")
  const [editingUser, setEditingUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const getUsers = async () => {
    try {
      const res = await api.get<Users[]>("/users/")
      setUsers(res.data)
    } catch (error) {
      console.error("Error fetching transactions", error)
    }
  }

  const addUsers = async () => {
    try {
      const res = await api.post("/users/", {
        fullname,
        email,
        age,
        country
      })
      getUsers()
      console.log(res.data)
      setAge('')
      setCountry('')
      setEmail('')
      setFullname('')
    } catch (error) {
      console.error("Error adding transaction", error)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      const res = await api.delete(`/users/${id}`)
      console.log(res.data)
      getUsers()
    } catch (error) {
      console.error("Error deleting transaction", error)
    }
  }

  const searchUsers = async (key: string) => {
    try {
      const res = await api.post<Users[]>("/users/search", null, {
        params: { key },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error searching users", error);
    }
  };

  useEffect(() => {
    const fetchTotal = async () => {
      const res = await api.get<{ total: number }>('/users/count');
      setTotalUsers(res.data.total);
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className={`min-h-screen Montserrat transition-all duration-500 p-6 ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center backdrop-blur-lg py-3 rounded-lg">
          <div className="flex gap-4 items-center">
            <img src="/logo.png" className="w-16 h-16" alt="logo" />
            <div>
              <div className="flex items-center gap-2 relative"><UserRound /><p className="text-sm bg-purple-600 text-white h-4 flex items-center justify-center left-3 w-4 rounded-full absolute -top-1">{totalUsers}</p></div>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex justify-center">
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button
                    size="4"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-lg transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <CirclePlus />
                  </Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="500px" className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl">
                  <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-transparent">
                    Nouvel utilisateur
                  </Dialog.Title>

                  <form>
                    <Flex direction="column" gap="4" className="mt-4">
                      <label>
                        <Text as="div" size="2" mb="2" weight="bold" className="text-sm font-semibold text-slate-700 tracking-wide">
                          Nom complet
                        </Text>
                        <TextField.Root
                          placeholder="Entrez le nom complet"
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          className="rounded-md border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/50 backdrop-blur-sm"
                        />
                      </label>
                      <label>
                        <Text as="div" size="2" mb="2" weight="bold" className="text-sm font-semibold text-slate-700 tracking-wide">
                          Email
                        </Text>
                        <TextField.Root
                          placeholder="Entrez l'email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-md border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/50 backdrop-blur-sm"
                        />
                      </label>
                      <label>
                        <Text as="div" size="2" mb="2" weight="bold" className="text-sm font-semibold text-slate-700 tracking-wide">
                          Âge
                        </Text>
                        <TextField.Root
                          placeholder="Entrez l'âge"
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="rounded-md border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/50 backdrop-blur-sm"
                        />
                      </label>
                      <label>
                        <Text as="div" size="2" mb="2" weight="bold" className="text-sm font-semibold text-slate-700 tracking-wide">
                          Pays
                        </Text>
                        <TextField.Root
                          placeholder="Entrez le pays"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="rounded-md border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/50 backdrop-blur-sm"
                        />
                      </label>
                    </Flex>
                  </form>

                  <Flex gap="3" mt="6" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray" className="rounded-md border-slate-200 hover:bg-slate-50">
                        Annuler
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button
                        onClick={addUsers}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none rounded-md shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Enregistrer
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 shadow-lg ${isDarkMode
                ? 'bg-yellow-400 hover:bg-yellow-300 text-gray-900'
                : 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                }`}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`w-full flex items-center gap-2 border shadow-sm rounded-md border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-xl text-gray-200' : 'bg-white/80 backdrop-blur-xl'
            }`}
        >
          <div className="flex items-center pl-2"><Search /></div>
          <input
            placeholder="Rechercher des utilisateurs..."
            onChange={(e) => searchUsers(e.target.value)}
            className={`border-0 outline-none w-full rounded-r-md  py-2 border-l px-5 ${isDarkMode ? 'bg-gray-800/50 backdrop-blur-xl text-gray-200' : 'bg-white/80 backdrop-blur-xl'
              }`}
          />
        </div>

        {/* Table */}
        <div className={`backdrop-blur-sm rounded-md shadow-sm overflow-hidden transition-all duration-300 ${isDarkMode
          ? 'bg-gray-800/70 border border-gray-600/20'
          : 'bg-white/70 border border-white/20'
          }`}>
          <Table.Root>
            <Table.Header>
              <Table.Row className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-700/50 border-gray-600/50' : 'bg-slate-50/50'
                }`}>
                <Table.ColumnHeaderCell className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>Nom complet</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>Âge</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>Pays</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className={`transition-colors duration-200 ${isDarkMode
                    ? 'border-gray-600/30 hover:bg-gray-700/30'
                    : 'border-slate-200/30 hover:bg-slate-50/50'
                    }`}
                >
                  <Table.RowHeaderCell className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                    {user.fullname}
                  </Table.RowHeaderCell>
                  <Table.Cell className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                    {user.email}
                  </Table.Cell>
                  <Table.Cell className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                    {user.age}
                  </Table.Cell>
                  <Table.Cell className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                    {user.country}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingUser(user as any)}
                        className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 py-3 px-2"

                      >
                        <Pencil size={18} />
                      </Button>
                      <Button
                        onClick={() => deleteUser(user._id)}
                        className={`py-3 px-2 rounded-sm transition-all duration-200 hover:scale-105 active:scale-95 ${isDarkMode
                          ? 'bg-red-900/30 hover:bg-red-800/50 text-red-400 hover:text-red-300'
                          : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
                          }`}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>

        <EditUserDialog
          usersOne={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={(updatedUser: any) => {
            setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
          }}
        />

      </div>
      <div className="max-w-7xl top-[100%] m-auto sticky flex felx-row items-center justify-between">
        <p>© RAKOTOMALALA <a className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" target="_blank" href="https://orione-tech.vercel.app">Hery Niaina Tahina</a></p>
        <div>
          <a href="https://github.com/rakotomalalaheryniainatahina-code/crud-django-react/" target="_blank">
            <Github />
          </a>
        </div>
      </div>
    </div>
  )
}

export default App