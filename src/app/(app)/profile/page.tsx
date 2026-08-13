"use client";
import { Camera, LockKeyhole } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function ProfilePage(){
  // TODO: Connect profile API
  return <div className="space-y-6"><header><h1 className="text-3xl font-semibold tracking-tight">Profile</h1><p className="mt-2 text-sm text-muted-foreground">Manage your personal information and preferences.</p></header><Card><CardHeader><CardTitle>Profile information</CardTitle><CardDescription>Update how you appear to the rest of your workspace.</CardDescription></CardHeader><CardContent className="space-y-6"><div className="flex items-center gap-4"><Avatar name="Ada Lovelace" className="size-16 text-lg"/><div><Button variant="outline"><Camera/>Change avatar</Button><p className="mt-2 text-xs text-muted-foreground">JPG, PNG, or GIF. Max size of 2MB.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><ProfileField label="Full name" value="Ada Lovelace"/><ProfileField label="Email" value="ada@flowdesk.io"/></div><div><Label>Role</Label><p className="mt-2 rounded-md border border-input bg-muted/40 px-3 py-2 text-sm">Workspace admin</p></div><Button>Save changes</Button></CardContent></Card><Card><CardHeader><CardTitle>Account preferences</CardTitle><CardDescription>Control your personal workspace experience.</CardDescription></CardHeader><CardContent><label className="flex items-center justify-between text-sm font-medium">Receive weekly workspace summary<input type="checkbox" defaultChecked className="size-4 accent-primary"/></label></CardContent></Card><Card><CardHeader><CardTitle>Security</CardTitle><CardDescription>Keep your account protected.</CardDescription></CardHeader><CardContent><Button variant="outline"><LockKeyhole/>Change password</Button></CardContent></Card></div>;
}
function ProfileField({label,value}:{label:string;value:string}){const id=label.toLowerCase().replaceAll(" ","-");return <div><Label htmlFor={id}>{label}</Label><Input id={id} defaultValue={value} className="mt-2"/></div>}
