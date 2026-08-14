"use client";

import { Camera, LockKeyhole } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { RoleBadge } from "@/components/roles/role-badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function ProfileField({ label, value }: { label: string; value: string }) {
  return <div><Label>{label}</Label><p className="mt-2 rounded-md border border-input bg-muted/40 px-3 py-2 text-sm">{value}</p></div>;
}

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <p className="text-sm text-muted-foreground">Loading your profile…</p>;

  return <div className="space-y-6"><header><h1 className="text-3xl font-semibold tracking-tight">Profile</h1><p className="mt-2 text-sm text-muted-foreground">Manage your personal information and preferences.</p></header><Card><CardHeader><CardTitle>Profile information</CardTitle><CardDescription>Update how you appear to the rest of your workspace.</CardDescription></CardHeader><CardContent className="space-y-6"><div className="flex items-center gap-4"><Avatar name={user.name} src={user.avatar ?? undefined} className="size-16 text-lg"/><div><Button variant="outline"><Camera/>Change avatar</Button><p className="mt-2 text-xs text-muted-foreground">JPG, PNG, or GIF. Max size of 2MB.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><ProfileField label="Full name" value={user.name}/><ProfileField label="Email" value={user.email}/></div><div><Label>Role</Label><div className="mt-2"><RoleBadge role={user.role}/></div></div><Button>Save changes</Button></CardContent></Card><Card><CardHeader><CardTitle>Account preferences</CardTitle><CardDescription>Control your personal workspace experience.</CardDescription></CardHeader><CardContent><label className="flex items-center justify-between text-sm font-medium">Receive weekly workspace summary<input type="checkbox" defaultChecked className="size-4 accent-primary"/></label></CardContent></Card><Card><CardHeader><CardTitle>Security</CardTitle><CardDescription>Keep your account protected.</CardDescription></CardHeader><CardContent><Button variant="outline"><LockKeyhole/>Change password</Button></CardContent></Card></div>;
}
