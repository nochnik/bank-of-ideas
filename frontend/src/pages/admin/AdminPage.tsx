import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Plus, Loader2, MoreVertical, Search, ArrowRight } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { getAllUsers, createUser, CreateUserPayload } from '@/api/admin'
import type { UserProfile } from '@/types'

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  // New user form state
  const [form, setForm] = useState<CreateUserPayload>({
    username: '',
    password: '',
    fullName: '',
    position: '',
  })

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!search) return users
    const q = search.toLowerCase()
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q) ||
        (u.position && u.position.toLowerCase().includes(q))
    )
  }, [users, search])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      const newUser = await createUser(form)
      setUsers((prev) => [...prev, newUser])
      setShowForm(false)
      setForm({ username: '', password: '', fullName: '', position: '' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка создания пользователя')
    } finally {
      setCreating(false)
    }
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((u) => u.id)))
  }

  const toggleRow = (id: number) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  if (loading) {
    return (
      <AdminLayout title="Участники">
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-ink-tertiary" size={24} /></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      breadcrumbs={[{ label: 'Участники' }]}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Управление участниками</h1>
          <p className="text-caption text-ink-subtle mt-1">Всего зарегистрировано: {users.length}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus size={14} />
          {t('admin.createUser')}
        </Button>
      </div>

      {/* Create user dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.createUser')}</DialogTitle>
            <DialogDescription>Новый участник получит доступ к платформе</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              {(['username', 'password', 'fullName', 'position'] as const).map((key) => (
                <div key={key}>
                  <label className="block text-caption text-ink-subtle mb-1">
                    {t(`auth.${key}`) || key} {key !== 'position' && '*'}
                  </label>
                  <Input
                    type={key === 'password' ? 'password' : 'text'}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    required={key !== 'position'}
                  />
                </div>
              ))}
              {error && <p className="text-caption text-danger">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? <Loader2 size={14} className="animate-spin" /> : 'Создать'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <motion.div
        className="bg-s1 border border-hl rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-4 border-b border-hl">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <Input
              placeholder="Поиск по имени или логину…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-s2"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-ink-tertiary text-body">
            Ничего не найдено
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-s2/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead className="text-eyebrow uppercase">Сотрудник</TableHead>
                  <TableHead className="hidden sm:table-cell text-eyebrow uppercase">Логин</TableHead>
                  <TableHead className="hidden md:table-cell text-eyebrow uppercase">Должность</TableHead>
                  <TableHead className="text-eyebrow uppercase">Роль</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id} className="border-b border-hl transition-colors hover:bg-s2">
                    <TableCell>
                      <Checkbox
                        checked={selected.has(u.id)}
                        onCheckedChange={() => toggleRow(u.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-hl shrink-0">
                          <AvatarImage src={u.avatarUrl ?? ''} alt={u.fullName} />
                          <AvatarFallback>
                            {u.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Link to={`/admin/users/${u.id}`} className="text-body font-medium text-ink hover:text-accent transition-colors">
                          {u.fullName}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <code className="text-caption text-ink-subtle font-mono">{u.username}</code>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-caption text-ink-tertiary">
                      {u.position ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'ADMIN' ? 'approved' : 'default'}>
                        {u.role === 'ADMIN' ? 'Админ' : 'Участник'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/users/${u.id}`} className="flex items-center gap-2">
                              <ArrowRight size={14} />
                              Открыть профиль
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  )
}
